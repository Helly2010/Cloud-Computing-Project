from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi_mail import FastMail
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Order, OrderDetail, OrderStatus, OrderTrackingStatus, Product, Supplier
from app.repositories.email.connector import EmailConnector
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import OrderCreateSerializer
from app.serializers.response import OrderSerializer
from app.tasks.inventory import trigger_restock_notification
from app.tasks.tracking import trigger_new_order_notification

router = APIRouter()


@router.get("/orders/", response_model=list[OrderSerializer])
async def get_orders(status: str = OrderStatus.ACTIVE, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    orders = await db.scalars(select(Order).where(Order.status == status).order_by(Order.id))

    return orders


@router.post("/orders/", response_model=OrderSerializer)
async def create_order(
    order_data: OrderCreateSerializer,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(PostgreSQLDBConnector.get_session),
    fm: FastMail = Depends(EmailConnector.get_connector),
):
    product_quantities = {p.product_id: p for p in order_data.products}
    products = (await db.scalars(select(Product).where(Product.id.in_(product_quantities.keys())))).all()

    if not products or len(products) != len(order_data.products):
        raise HTTPException(status_code=400, detail="No products found for order or invalid products found in list")

    new_order = Order(
        customer_name=order_data.customer_name,
        customer_shipping_info=order_data.customer_shipping_info.model_dump(),
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        payment_method=order_data.payment_method.model_dump(),
        status=OrderStatus.ACTIVE,
        tracking_status=OrderTrackingStatus.SHIPMENT_CREATED,
        order_total=10,
    )

    db.add(new_order)
    await db.flush()
    await db.refresh(new_order)

    order_details = []

    for product in products:
        required_stock = product_quantities[product.id].amount

        if product.stock.quantity < required_stock:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")

        product.stock.quantity = product.stock.quantity - required_stock

        if product.stock.quantity < product.reorder_level:
            supplier = (await db.scalars(select(Supplier).where(Supplier.id == product.supplier_id))).first()
            if not supplier:
                raise HTTPException(status_code=500, detail=f"Supplier not found for product {product.id}")

            background_tasks.add_task(trigger_restock_notification, fm, product, supplier)

        order_details.append(OrderDetail(product_id=product.id, order_id=new_order.id, product_price=product.public_unit_price))

    await db.commit()

    background_tasks.add_task(trigger_new_order_notification, fm, new_order, order_details)

    return new_order
