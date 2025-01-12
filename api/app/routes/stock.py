from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Stock
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import StockCreateSerializer, StockUpdateSerializer
from app.serializers.response import StockSerializer

router = APIRouter()


@router.get("/stock/", response_model=list[StockSerializer])
async def get_stock(db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    stock = (await db.scalars(select(Stock).order_by(stock.id))).all()
    return stock


@router.get("/stock/{stock_id}", response_model=StockSerializer)
async def get_stock(stock_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    db_stock = await db.get(Stock, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    return db_stock


@router.post("/stock/", response_model=StockSerializer)
async def create_stock(stock: StockCreateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        new_stock = stock(
            quantity=stock.quantity,
          
        )

        db.add(new_stock)
        await db.commit()
    return new_stock


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
