from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, PrimaryKeyConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.repositories.postgres.connector import PostgreSQLDBConnector


class Stock(PostgreSQLDBConnector.Base):
    __tablename__ = "stock"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (PrimaryKeyConstraint("id", name="pk_stock"),)


class Product(PostgreSQLDBConnector.Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    ean_code: Mapped[int] = mapped_column(Integer, nullable=False, index=True, unique=True)
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id"), nullable=False)
    supplier_id: Mapped[int] = mapped_column(Integer, ForeignKey("suppliers.id"), nullable=False)
    stock_id: Mapped[int] = mapped_column(Integer, ForeignKey("stock.id"), index=True)
    description: Mapped[str] = mapped_column(String, nullable=False)
    public_unit_price: Mapped[int] = mapped_column(Integer, nullable=False)
    supplier_unit_price: Mapped[int] = mapped_column(Integer, nullable=False)
    img_link: Mapped[str] = mapped_column(String, nullable=False)
    reorder_level: Mapped[int] = mapped_column(Integer, nullable=False)
    extra_info: Mapped[dict] = mapped_column(JSON, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), server_default=func.now(), onupdate=func.now()
    )

    stock: Mapped[Stock] = relationship("Stock", lazy="joined")
    category: Mapped["Category"] = relationship("Category", lazy="joined")
    supplier: Mapped["Supplier"] = relationship("Supplier", lazy="joined")

    __table_args__ = (PrimaryKeyConstraint("id", name="pk_products"),)


class Category(PostgreSQLDBConnector.Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    extra_info: Mapped[dict] = mapped_column(JSON, nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (PrimaryKeyConstraint("id", name="pk_categories"),)


class Supplier(PostgreSQLDBConnector.Base):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (PrimaryKeyConstraint("id", name="pk_suppliers"),)


class Order(PostgreSQLDBConnector.Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    order_total: Mapped[int] = mapped_column(Integer, nullable=False)
    customer_name: Mapped[str] = mapped_column(String, nullable=False)
    customer_shipping_info: Mapped[dict] = mapped_column(JSON, nullable=False)
    customer_phone: Mapped[str] = mapped_column(String, nullable=False)
    customer_email: Mapped[str] = mapped_column(String, nullable=False)
    payment_method: Mapped[dict] = mapped_column(JSON, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (PrimaryKeyConstraint("id", name="pk_categories"),)


class OrderDetail(PostgreSQLDBConnector.Base):
    __tablename__ = "order_details"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False, index=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), nullable=False)
    product_price: Mapped[int] = mapped_column(Integer, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=func.now(),
        server_default=func.now(),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (PrimaryKeyConstraint("id", name="pk_order_details"),)
