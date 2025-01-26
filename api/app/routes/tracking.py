from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from fastapi_mail import FastMail
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Order
from app.repositories.email.connector import EmailConnector
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import OrderTrackingSerializer
from app.serializers.response import OrderSerializer
from app.tasks.tracking import trigger_order_status_update_notification

router = APIRouter(prefix="/tracking")


@router.patch("/{order_id}", response_model=OrderSerializer)
async def update_order_status(
    order_id: int,
    order_update: OrderTrackingSerializer,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(PostgreSQLDBConnector.get_session),
    fm: FastMail = Depends(EmailConnector.get_connector),
):
    async with db.begin():
        db_order = await db.get(Order, order_id)
        if not db_order:
            raise HTTPException(status_code=404, detail="Order not found")

        previous_status = db_order.tracking_status
        new_status = order_update.tracking_status
        db_order.tracking_status = new_status

        if previous_status != new_status:
            print(new_status)
            background_tasks.add_task(trigger_order_status_update_notification, fm, db_order, previous_status, new_status)

        await db.commit()

    return db_order
