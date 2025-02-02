from app.repositories.db.models import Product, Supplier
from app.repositories.email.connector import FastMail
from app.repositories.email.emails_utils import send_email
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List


MANAGER_EMAIL = "manager@lowtechgmbh.com"
LOW_STOCK_THRESHOLD = 10  # Define a threshold for low stock

async def trigger_restock_notification(fm: FastMail, product: Product, supplier: Supplier):
    await send_email(
        fm,
        supplier.email,
        f"Product ean:{product.ean_code} needs restock",
        f"Please dispatch an order of {product.reorder_ammount} {product.name}",
    )

async def check_inventory_levels(db: AsyncSession, fm: FastMail):
    """Check inventory levels and notify the manager if stock is low."""
    result = await db.scalars(select(Product).where(Product.stock_quantity <= LOW_STOCK_THRESHOLD))
    low_stock_products: List[Product] = result.all()

    if low_stock_products:
        product_details = "\n".join([
            f"- {product.name} (Stock: {product.stock_quantity})"
            for product in low_stock_products
        ])
        email_content = f"""
        <h2>Low Stock Alert</h2>
        <p>The following products are running low on stock and need replenishment:</p>
        <ul>
            {''.join([f'<li>{product.name} (Stock: {product.stock_quantity})</li>' for product in low_stock_products])}
        </ul>
        <p>Please take necessary action to restock these items.</p>
        """
        
        await send_email(
            fm,
            MANAGER_EMAIL,
            "Urgent: Low Stock Alert",
            email_content,
        )