from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.repositories.db.models import Product
from app.serializers.response import ProductSerializer
from app.serializers.request import ProductCreate, ProductUpdate
from sqlalchemy import select

router = APIRouter()


@router.get("/products/", response_model=list[ProductSerializer])
async def get_products(db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    products = await db.scalars(select(Product).order_by(Product.id))
    return products


@router.post("/products/", response_model=ProductSerializer)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        new_product = Product(
            name=product.name,
            ean_code=product.ean_code,
            category_id=product.category_id,
            supplier_id=product.supplier_id,
            description=product.description,
            public_unit_price=product.public_unit_price,
            supplier_unit_price=product.supplier_unit_price,
            img_link=product.img_link,
            reorder_level=product.reorder_level,
            metadata=product.metadata
        )
    
        db.add(new_product)
        await db.flush()
        await db.refresh(new_product)
    return new_product

@router.patch("/products/{product_id}", response_model=ProductSerializer)
async def update_product(product_id: int, product_update: ProductUpdate, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        db_product = await db.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        update_data = product_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        await db.flush()
        await db.refresh(db_product)
    
    return db_product

@router.delete("/products/{product_id}", response_model=ProductSerializer)
async def delete_product(product_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        db_product = await db.get(Product, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")
        await db.delete(db_product)
        await db.flush()
    return db_product

