from app.repositories.db.models import Product, Supplier
from app.repositories.email.connector import FastMail
from app.repositories.email.emails_utils import send_email


async def trigger_restock_notification(fm: FastMail, product: Product, supplier: Supplier):
    await send_email(
        fm,
        supplier.email,
        f"Product ean:{product.ean_code} needs restock",
        f"Please dispatch an order of {product.reorder_ammount} {product.name}",
    )
