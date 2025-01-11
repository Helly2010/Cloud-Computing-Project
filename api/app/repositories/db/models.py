from sqlalchemy import Column, Integer, String,ForeignKey,DateTime,JSON,Rela
from database import Base
from sqlalchemy.orm import relationship
class Stock(Base):
    __tablename__ = 'stock'

    id = Column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('product.id'), nullable=False, unique=True,index=True)
    quantity = Column(Integer, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)
    product = relationship('Product', back_populates='stock', uselist=False)

class Product(Base):
    __tablename__ = 'product'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    name = Column(String, nullable=False)
    ean_code = Column(Integer, nullable=False,index=True,unique=True)
    category_id = Column(Integer, ForeignKey('category.id'), nullable=False)
    supplier_id = Column(Integer, ForeignKey('supplier.id'), nullable=False)
    description = Column(String, nullable=False)
    public_unit_price = Column(Integer, nullable=False)
    supplier_unit_price = Column(Integer, nullable=False)
    img_link = Column(String, nullable=False)
    reorder_level = Column(Integer, nullable=False)
    metadata = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    stock = relationship('Stock', back_populates='product')
    category = relationship('Category', back_populates='product')
    supplier = relationship('Supplier', back_populates='product')
    orderdetail = relationship('OrderDetail',back_populates='product')
class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    metadata = Column(JSON, nullable=False)

    product = relationship('Product', back_populates='category', uselist=True)

class Supplier(Base):
    __tablename__ = 'supplier'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False,unique=True)
    email = Column(String, nullable=False,unique=True)

    product = relationship('Product', back_populates='supplier', uselist=True)

class OrdersHeader(Base):
    __tablename__ = 'orderheader'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    order_total = Column(Integer, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_shipping_info = Column(JSON, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    payment_method = Column(JSON, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    orderdetail = relationship('OrderDetail', back_populates='orderheader', uselist=True)

class OrderDetail(Base):
    __tablename__ = 'orderdetail'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    product_id = Column(Integer, ForeignKey('product.id'), nullable=False, index=True)
    orderheader_id = Column(Integer, ForeignKey('orderheader.id'), nullable=False)
    product_price = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    orderheader = relationship('OrderHeader', back_populates='orderdetail')
    product = relationship('Product', back_populates='orderdetail')