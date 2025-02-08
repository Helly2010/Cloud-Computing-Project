from pydantic import BaseModel, computed_field
from datetime import datetime
from money import Money  # type: ignore


class OrderSerializer(BaseModel):
    id: int
    order_total: int
    customer_name: str
    tracking_status: str
    customer_shipping_info: dict
    customer_phone: str
    customer_email: str
    payment_method: dict
    status: str
    updated_at: datetime
    created_at: datetime


class ProductBaseSerializer(BaseModel):
    id: int
    name: str
    ean_code: int
    description: str
    public_unit_price: int
    img_link: str
    extra_info: dict
    currency: str

    stock: "StockSerializer"
    category: "CategorySerializer"

    @computed_field  # type: ignore
    @property
    def formatted_price(self) -> str:
        return Money(amount=f"{self.public_unit_price/100:.2f}", currency=self.currency).format("de_DE")


class ProductSerializer(ProductBaseSerializer):
    category_id: int
    supplier_id: int
    stock_id: int
    reorder_level: int
    supplier_unit_price: int
    updated_at: datetime
    created_at: datetime

    supplier: "SupplierBaseSerializer"


class CategoryBaseSerializer(BaseModel):
    id: int
    name: str
    description: str
    extra_info: dict


class CategorySerializer(CategoryBaseSerializer):
    updated_at: datetime
    created_at: datetime


class SupplierBaseSerializer(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    email: str


class SupplierSerializer(SupplierBaseSerializer):
    updated_at: datetime
    created_at: datetime


class StockBaseSerializer(BaseModel):
    id: int
    quantity: int


class StockSerializer(StockBaseSerializer):
    updated_at: datetime
    created_at: datetime
