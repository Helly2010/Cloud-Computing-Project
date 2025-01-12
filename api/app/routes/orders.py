from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.repositories.db.models import Order, OrderStatus, OrderTrackingStatus, Product, OrderDetail
from app.serializers.response import OrderSerializer
from app.serializers.request import OrderCreateSerializer
from sqlalchemy import select

router = APIRouter()


@router.get("/orders/", response_model=list[OrderSerializer])
async def get_orders(status: str = OrderStatus.ACTIVE, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    orders = await db.scalars(select(Order).where(Order.status == status).order_by(Order.id))

    return orders


@router.post("/orders/", response_model=OrderSerializer)
async def create_order(order_data: OrderCreateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
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
                pass  # Here queue a notification to restock product

            order_details.append(OrderDetail(product_id=product.id, order_id=new_order.id, product_price=product.public_unit_price))

        await db.commit()

    # Here enqueue an email to the customer

    return new_order
