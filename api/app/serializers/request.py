from enum import StrEnum
from typing import Optional
from pydantic import BaseModel

from app.repositories.db.models import OrderTrackingStatus


class PaymentProviders(StrEnum):
    PAYPAL = "PAYPAL"
    STRIPE = "STRIPE"


class PaymentInfo(BaseModel):
    credit_card_number: Optional[str] = None
    payment_provider: PaymentProviders


class ShippingInfo(BaseModel):
    street: str
    zip_code: str
    city: str


class ProductQuantity(BaseModel):
    product_id: int
    amount: int


class OrderCreateSerializer(BaseModel):
    customer_name: str
    customer_shipping_info: ShippingInfo
    customer_phone: str
    customer_email: str
    payment_method: PaymentInfo
    products: list[ProductQuantity]


class OrderTrackingSerializer(BaseModel):
    tracking_status: OrderTrackingStatus


class ProductCreateSerializer(BaseModel):
    name: str
    ean_code: int
    category_id: int
    supplier_id: int
    description: str
    public_unit_price: int
    supplier_unit_price: int
    img_link: str
    reorder_level: int
    extra_info: dict


class ProductUpdateSerializer(BaseModel):
    product_id: int
    name: str | None = None
    ean_code: int | None = None
    category_id: int | None = None
    supplier_id: int | None = None
    description: str | None = None
    public_unit_price: int | None = None
    supplier_unit_price: int | None = None
    img_link: str | None = None
    reorder_level: int | None = None
    metadata: dict | None = None


class CategoryCreateSerializer(BaseModel):
    name: str
    description: str
    extra_info: dict


class CategoryUpdateSerializer(BaseModel):
    name: str | None = None
    description: str | None = None
    extra_info: dict | None = None


class SupplierCreateSerializer(BaseModel):
    name: str
    address: str
    phone: str
    email: str


class SupplierUpdateSerializer(BaseModel):
    name: str | None = None
    address: str | None = None
    phone: str | None = None
    email: str | None = None


class StockCreateSerializer(BaseModel):
    quantity: str


class StockUpdateSerializer(BaseModel):
    quantity: int
