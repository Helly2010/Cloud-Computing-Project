from app.repositories.db.models import Order, OrderDetail, Product
from app.repositories.email.connector import FastMail
from app.repositories.email.emails_utils import send_email
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.postgres.connector import PostgreSQLDBConnector

def get_base_template(content: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Update</title>
        <style>
            body {{
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 800px;
                margin: 0 auto;
                background-color: #ffffff;
                overflow: hidden;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }}
            .header {{
                background-color: #4a90e2;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
                text-transform: uppercase;
            }}
            .content {{
                padding: 30px;
            }}
            .table-container {{
                width: 100%;
                overflow-x: auto;
            }}
            .order-table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }}
            .order-table th, .order-table td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            .order-table th {{
                background-color: #f2f2f2;
                font-weight: bold;
            }}
            .footer {{
                background-color: #333;
                color: #ffffff;
                text-align: center;
                padding: 15px;
                font-size: 14px;
            }}
            .btn {{
                display: inline-block;
                padding: 10px 20px;
                background-color: #4a90e2;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 15px;
            }}
            @media only screen and (max-width: 600px) {{
                .container {{
                    width: 100%;
                    margin: 0;
                    border-radius: 0;
                }}
                .content {{
                    padding: 15px;
                }}
                .order-table {{
                    font-size: 14px;
                }}
                .order-table th, .order-table td {{
                    padding: 6px;
                }}
            }}
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
                <a href="https://www.google.de/" class="btn">Visit Our Store</a>
            </div>
        </div>
    </body>
    </html>
    """


async def trigger_new_order_notification(fm: FastMail, order: Order, order_details: List[OrderDetail], db: AsyncSession):
    # Fetch product details
    product_ids = [detail.product_id for detail in order_details]
    products = {product.id: product for product in (await db.scalars(select(Product).where(Product.id.in_(product_ids)))).all()}

    product_info = "".join([
        f"""
        <tr>
            <td data-label="Product">{products[detail.product_id].name}</td>
            <td data-label="Quantity">{detail.quantity}</td>
            <td data-label="Unit Price">{detail.product_price:.2f}€</td>
            <td data-label="Subtotal">{detail.subtotal:.2f}€</td>
        </tr>
        """
        for detail in order_details
    ])

    content = f"""
    <h2>Dear {order.customer_name},</h2>
    <p>Thank you for your order! We're excited to confirm that your order has been successfully placed and is being processed.</p>
    
    <h3>Order Details:</h3>
    <p><strong>Order Confirmation Number:</strong> {order.id}</p>
    <p><strong>Order Date:</strong> {order.created_at.strftime('%B %d, %Y')}</p>
    
    <h4>Shipping Address:</h4>
    <p>
    {order.customer_shipping_info['street']} <br>
    {order.customer_shipping_info['zip_code']},{order.customer_shipping_info['city']}</p>
    
    <h4>Items Ordered:</h4>
    <table class="order-table">
        <thead>
            <tr>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {product_info}
            <tr>
                <td data-label="Order Total" colspan="3" style="text-align: right;"><strong>Order Total:</strong></td>
                <td data-label="Total Amount"><strong>{order.order_total:.2f}€</strong></td>
            </tr>
        </tbody>
    </table>
    
    <h3>What's Next?</h3>
    <p>We're preparing your order for shipment. You'll receive emails from our side whenever your order tracking status is updated.</p>
    
    <h3>Our 14-Day Return Policy</h3>
    <p>We want you to be completely satisfied with your purchase. If for any reason you're not happy with your order, you can return it within 14 days of receipt for a full refund or exchange. Please ensure items are unused and in their original packaging.</p>
    
    <h3>Need Help?</h3>
    <p>If you have any questions about your order or our return policy, please don't hesitate to contact our customer service team at infolowtechgmbh@gmail.com</p>
    
    <p>Thank you again for choosing Our Store. We appreciate your business and hope you enjoy your purchase!</p>
    
    <p>Best regards,<br>
    LowTech Gmbh Team</p>
    """

    email_body = get_base_template(content)

    await send_email(
        fm,
        order.customer_email,
        f"LowTech Gmbh: Order Confirmation - Order #{order.id}",
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
