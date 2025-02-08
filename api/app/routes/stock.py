from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Product, Stock
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import StockUpdateSerializer
from app.serializers.response import StockSerializer

router = APIRouter()


@router.get("/stock/{product_id}", response_model=dict)
async def get_stock(product_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    db_product = await db.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    db_stock = await db.get(Stock, db_product.stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found for this product")

    return {"product_id": product_id, "quantity": db_stock.quantity}


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

    return db_stock
