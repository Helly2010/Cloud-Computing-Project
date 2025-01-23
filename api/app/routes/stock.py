from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Product, Stock
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import StockUpdateSerializer
from app.serializers.response import StockSerializer

router = APIRouter()


@router.patch("/stock/{product_id}", response_model=StockSerializer)
async def update_stock(
    product_id: int, stock_update: StockUpdateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)
):
    async with db.begin():
        db_stock = (
            await db.scalars(
                select(Stock).where(Stock.id == select(Product.stock_id).where(Product.id == product_id).scalar_subquery())
            )
        ).first()
        if not db_stock:
            raise HTTPException(status_code=404, detail="Stock not found")

        db_stock.quantity = stock_update.quantity

        await db.commit()
        await db.refresh(db_stock)

        # Expire the session state to ensure up-to-date data on subsequent requests
        await db.expire_all()

    return db_stock
