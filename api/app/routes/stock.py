from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Stock
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import StockUpdateSerializer
from app.serializers.response import StockSerializer

router = APIRouter()


@router.patch("/stock/{stock_id}", response_model=StockSerializer)
async def update_stock(
    stock_id: int, stock_update: StockUpdateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)
):
    async with db.begin():
        db_stock = await db.get(Stock, stock_id)
        if not db_stock:
            raise HTTPException(status_code=404, detail="Stock not found")

        update_data = stock_update.model_dump(exclude_unset=True, exclude_none=True)
        for field, value in update_data.items():
            setattr(db_stock, field, value)

        await db.commit()

    return db_stock
