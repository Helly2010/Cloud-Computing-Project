from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.repositories.db.models import Product, Stock
from app.serializers.response import ProductSerializer
from app.serializers.request import ProductCreateSerializer, ProductUpdateSerializer
from sqlalchemy import select

router = APIRouter()


@router.get("/products/", response_model=list[ProductSerializer])
async def get_products(db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    products = (await db.scalars(select(Product).order_by(Product.id))).all()
    return products


@router.get("/products/{product_id}", response_model=ProductSerializer)
async def get_product(product_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    db_product = await db.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    return db_product


@router.post("/products/", response_model=ProductSerializer)
async def create_product(product: ProductCreateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        new_stock = Stock(quantity=0)

        db.add(new_stock)
        await db.flush()
        await db.refresh(new_stock)

        new_product = Product(
            name=product.name,
            ean_code=product.ean_code,
            category_id=product.category_id,
            supplier_id=product.supplier_id,
            stock_id=new_stock.id,
            description=product.description,
            public_unit_price=product.public_unit_price,
            supplier_unit_price=product.supplier_unit_price,
            img_link=product.img_link,
            reorder_level=product.reorder_level,
            extra_info=product.extra_info,
        )

        db.add(new_product)
        await db.commit()
    return new_product


@router.patch("/products/{product_id}", response_model=ProductSerializer)
async def update_product(
    product_id: int, product_update: ProductUpdateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)
):
    async with db.begin():
        db_product = await db.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")

        update_data = product_update.model_dump(exclude_unset=True, exclude_none=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)

        await db.commit()

    return db_product


@router.delete("/products/{product_id}", response_model=ProductSerializer)
async def delete_product(product_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        db_product = await db.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        await db.delete(db_product)

    return db_product
