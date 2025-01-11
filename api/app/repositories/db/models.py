from sqlalchemy import Column, Integer, String,ForeignKey,DateTime,JSON,Rela
from database import Base
from sqlalchemy.orm import relationship

class Stocks(Base):
    __tablename__ = 'stocks'

    id = Column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, unique=True,index=True)
    quantity = Column(Integer, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False)

    products = relationship('Products', back_populates='stocks', uselist=False)

class Products(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    name = Column(String, nullable=False)
    ean_code = Column(Integer, nullable=False,index=True,unique=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'), nullable=False)
    description = Column(String, nullable=False)
    public_unit_price = Column(Integer, nullable=False)
    supplier_unit_price = Column(Integer, nullable=False)
    img_link = Column(String, nullable=False)
    reorder_level = Column(Integer, nullable=False)
    metadata = Column(JSON, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    stocks = relationship('Stocks', back_populates='products')
    categories = relationship('Categories', back_populates='products')
    suppliers = relationship('Suppliers', back_populates='products')
    order_details = relationship('OrderDetails',back_populates='products')

class Categories(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    metadata = Column(JSON, nullable=False)

    products = relationship('Products', back_populates='categories', uselist=True)

class Suppliers(Base):
    __tablename__ = 'suppliers'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    phone = Column(String, nullable=False,unique=True)
    email = Column(String, nullable=False,unique=True)

    products = relationship('Products', back_populates='suppliers', uselist=True)

class Orders(Base):
    __tablename__ = 'orders'

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

    order_details = relationship('OrderDetails', back_populates='orders', uselist=True)

class OrderDetails(Base):
    __tablename__ = 'order_details'

    id = Column(Integer, primary_key=True, nullable=False,index=True,autoincrement=True)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    product_price = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)

    orders = relationship('orders', back_populates='order_details')
    products = relationship('Products', back_populates='order_details')