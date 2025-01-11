from sqlalchemy import Column, Integer, String,ForeignKey,DateTime,JSON,Rela
from database import Base

class Stock(Base):
    __tablename__ = 'Stock'

    id = Column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('product.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)

class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, nullable=False,index=True)
    name = Column(String, nullable=False)
    ean_code = Column(Integer, nullable=False,index=True,unique=True)
    category_id = Column(Integer, ForeignKey('category.id'), nullable=False)
    supplier_id = Column(Integer, ForeignKey('supplier.id'), nullable=False)
    description = Column(String, nullable=False)
    public_unit_price = Column(Integer, nullable=False)
    supplier_unit_price = Column(Integer, nullable=False)
    ig_link = Column(String, nullable=False)
    reorder_level = Column(Integer, nullable=False)
    metadata = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

