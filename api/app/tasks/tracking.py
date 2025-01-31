from app.repositories.db.models import Order, OrderDetail, Product
from app.repositories.email.connector import FastMail
from app.repositories.email.emails_utils import send_email
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.postgres.connector import PostgreSQLDBConnector


def get_base_template(content: str) -> str:
    return f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #f4f4f4; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; }}
            table {{ width: 100%; border-collapse: collapse; margin-bottom: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
            .footer {{ background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Your Order Update</h1>
            </div>
            <div class="content">
                {content}
            </div>
            <div class="footer">
                <p>Thank you for shopping with us!</p>
            </div>
        </div>
    </body>
    </html>
    """

async def trigger_new_order_notification(fm: FastMail, order: Order, order_details: List[OrderDetail], db: AsyncSession):
    # Fetch product details
    product_ids = [detail.product_id for detail in order_details]
    products = {product.id: product for product in (await db.scalars(select(Product).where(Product.id.in_(product_ids)))).all()}

    # Calculate order total and create product info table
    product_info = "".join([
        f"<tr><td>{products[detail.product_id].name}</td><td>{detail.quantity}</td><td>{detail.product_price:.2f}€</td><td>${detail.subtotal:.2f}€</td></tr>"
        for detail in order_details
    ])

    content = f"""
    <h2>Thank you for your order!</h2>
    <p>Your order #{order.id} has been successfully placed.</p>
    <h3>Order Details:</h3>
    <table>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
        </tr>
        {product_info}
        <tr>
            <td colspan="3" style="text-align: right;"><strong>Order Total:</strong></td>
            <td><strong>${order.order_total:.2f}€</strong></td>
        </tr>
    </table>
    <p>We will notify you when your order status changes.</p>
    """

    email_body = get_base_template(content)

    await send_email(
        fm,
        order.customer_email,
        f"Order Confirmation - Order #{order.id}",
        email_body,
    )

async def trigger_order_status_update_notification(fm: FastMail, order: Order, previous_status: str, new_status: str):
    content = f"""
    <h2>Order Status Update</h2>
    <p>Your order #{order.id} status has been updated.</p>
    <ul>
        <li>Previous status: {previous_status}</li>
        <li>New status: <strong>{new_status}</strong></li>
    </ul>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    """

    email_body = get_base_template(content)

    await send_email(
        fm,
        order.customer_email,
        f"Order #{order.id} Status Update: {new_status}",
        email_body,
    )
