from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks,Request

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.repositories.db.models import Order, OrderStatus, OrderTrackingStatus, Product, OrderDetail
from app.serializers.response import OrderSerializer
from app.serializers.request import OrderCreateSerializer, OrderUpdateSerializer
from sqlalchemy import select
import httpx
from app.repositories.email.emails_utils import send_email

router = APIRouter()

@router.post("/webhook/new-order")
async def new_order_webhook(request: Request):
    order_data = await request.json()
    await send_email(
        order_data['customer_email'],
        f"New Order Confirmation - Order #{order_data['id']}",
        f"Thank you for your order! Your order #{order_data['id']} has been successfully placed."
    )
    return {"status": "success"}

@router.post("/webhook/order-status-update")
async def order_status_update_webhook(request: Request):
    update_data = await request.json()
    await send_email(
        update_data['customer_email'],
        f"Order #{update_data['order_id']} Status Updated",
        f"Your order status has been updated to {update_data['new_status']}."
    )
    return {"status": "success"}

@router.post("/webhook/restock-alert")
async def restock_alert_webhook(request: Request):
    restock_data = await request.json()
    await send_email(
        "inventory_manager@example.com",
        f"Restock Alert: Product {restock_data['product_name']} (ID: {restock_data['product_id']})",
        f"The stock for product {restock_data['product_name']} (ID: {restock_data['product_id']}) has fallen below the reorder level. Current quantity: {restock_data['current_quantity']}"
    )
    return {"status": "success"}

@router.get("/orders/", response_model=list[OrderSerializer])
async def get_orders(status: str = OrderStatus.ACTIVE, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    orders = await db.scalars(select(Order).where(Order.status == status).order_by(Order.id))

    return orders


@router.post("/orders/", response_model=OrderSerializer)
async def create_order(order_data: OrderCreateSerializer, background_tasks: BackgroundTasks, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    products = (await db.scalars(select(Product).where(Product.id.in_(order_data.products.keys())))).all()

    if not products or len(products) != len(order_data.products):
        raise HTTPException(status_code=400, detail="No products found for order or invalid products found in list")

    async with db.begin():
        new_order = Order(
            customer_name=order_data.customer_name,
            customer_shipping_info=order_data.customer_shipping_info.model_dump(),
            customer_phone=order_data.customer_phone,
            customer_email=order_data.customer_email,
            payment_method=order_data.payment_method.model_dump(),
            status=OrderStatus.ACTIVE,
            tracking_status=OrderTrackingStatus.SHIPMENT_CREATED,
        )

        db.add(new_order)
        await db.flush()
        await db.refresh(new_order)

        order_details = []

        for product in products:
            required_stock = order_data.products[product.id]

            if product.stock.quantity < required_stock:
                raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")

            product.stock.quantity = product.stock.quantity - required_stock

            if product.stock.quantity < product.reorder_level:
                background_tasks.add_task(trigger_restock_webhook, product.id, product.name, product.stock.quantity)

            order_details.append(OrderDetail(product_id=product.id, order_id=new_order.id, product_price=product.public_unit_price))

        await db.commit()

    background_tasks.add_task(trigger_new_order_webhook, new_order.id, new_order.customer_email)

    return new_order

@router.patch("/orders/{order_id}", response_model=OrderSerializer)
async def update_order_status(
    order_id: int, 
    order_update: OrderUpdateSerializer, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)
):
    async with db.begin():
        db_order = await db.get(Order, order_id)
        if not db_order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if "tracking_status" in order_update.dict(exclude_unset=True):
            previous_status = db_order.tracking_status
            new_status = order_update.tracking_status
            db_order.tracking_status = new_status

            if previous_status != new_status:
                background_tasks.add_task(
                    trigger_order_status_update_webhook, 
                    db_order.id, 
                    db_order.customer_email, 
                    new_status
                )

        await db.flush()
        await db.refresh(db_order)

    return db_order

async def trigger_new_order_webhook(order_id: int, customer_email: str):
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://your-webhook-url/webhook/new-order",
            json={"id": order_id, 
                  "customer_email": customer_email
            }
        )


async def trigger_order_status_update_webhook(order_id: int, customer_email: str, new_status: str):
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://your-webhook-url/webhook/order-status-update",
            json={"order_id": order_id, 
                  "customer_email": customer_email, 
                  "new_status": new_status
            }
        )

async def trigger_restock_webhook(product_id: int, product_name: str, current_quantity: int):
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://your-webhook-url/webhook/restock-alert",
            json={
                "product_id": product_id,
                "product_name": product_name,
                "current_quantity": current_quantity
            }
        )
