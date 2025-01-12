from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Category
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import CategoryCreateSerializer, CategoryUpdateSerializer
from app.serializers.response import CategorySerializer

router = APIRouter()


@router.get("/categories/", response_model=list[CategorySerializer])
async def get_categories(db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    categories = (await db.scalars(select(Category).order_by(Category.id))).all()
    return categories


@router.get("/categories/{category_id}", response_model=CategorySerializer)
async def get_category(category_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    db_category = await db.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    return db_category


@router.post("/categories/", response_model=CategorySerializer)
async def create_category(category: CategoryCreateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        new_category = Category(
            name=category.name,
            description=category.description,
            extra_info=category.extra_info,
        )

        db.add(new_category)
        await db.commit()
    return new_category


@router.patch("/categories/{category_id}", response_model=CategorySerializer)
async def update_category(
    category_id: int, category_update: CategoryUpdateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)
):
    async with db.begin():
        db_category = await db.get(Category, category_id)
        if not db_category:
            raise HTTPException(status_code=404, detail="Category not found")

        update_data = category_update.model_dump(exclude_unset=True, exclude_none=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)

        await db.commit()

    return db_category
