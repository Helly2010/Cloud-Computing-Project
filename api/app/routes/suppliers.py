from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.db.models import Supplier
from app.repositories.postgres.connector import PostgreSQLDBConnector
from app.serializers.request import SupplierCreateSerializer, SupplierUpdateSerializer
from app.serializers.response import SupplierSerializer

router = APIRouter()


@router.get("/suppliers/", response_model=list[SupplierSerializer])
async def get_suppliers(db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    suppliers = (await db.scalars(select(Supplier).order_by(Supplier.id))).all()
    return suppliers


@router.get("/suppliers/{supplier_id}", response_model=SupplierSerializer)
async def get_supplier(supplier_id: int, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    db_supplier = await db.get(Supplier, supplier_id)
    if not db_supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    return db_supplier


@router.post("/suppliers/", response_model=SupplierSerializer)
async def create_supplier(supplier: SupplierCreateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)):
    async with db.begin():
        new_supplier = Supplier(
            name=supplier.name,
            address=supplier.address,
            phone=supplier.phone,
            email=supplier.email,
        )

        db.add(new_supplier)
        await db.commit()
    return new_supplier


@router.patch("/supplier/{supplier_id}", response_model=SupplierSerializer)
async def update_supplier(
    supplier_id: int, supplier_update: SupplierUpdateSerializer, db: AsyncSession = Depends(PostgreSQLDBConnector.get_session)
):
    async with db.begin():
        db_supplier = await db.get(Supplier, supplier_id)
        if not db_supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")

        update_data = supplier_update.model_dump(exclude_unset=True, exclude_none=True)
        for field, value in update_data.items():
            setattr(db_supplier, field, value)

        await db.commit()

    return db_supplier
