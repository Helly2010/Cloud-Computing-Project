from app.repositories.db.models import Order, OrderDetail
from app.repositories.email.connector import FastMail
from app.repositories.email.emails_utils import send_email


async def trigger_new_order_notification(fm: FastMail, order: Order, order_details: list[OrderDetail]):
    await send_email(
        fm,
        order.customer_email,
        f"Order # {order.id} has been placed",
        f"Thank you for your order! Your order #{order.id} has been successfully placed.",
    )


async def trigger_order_status_update_notification(fm: FastMail, order: Order, previous_status: str, new_status: str):
    await send_email(
        fm,
        order.customer_email,
        f"Order # {order.id} is now {new_status}",
        f"Your order #{order.id} status has been updated from {previous_status} to {new_status}",
    )
