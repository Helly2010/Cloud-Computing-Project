from pydantic import BaseModel


class PaymentInfo(BaseModel):
    credit_card_number: str
    ccv: str
    expiration_date: str


class ShippingInfo(BaseModel):
    street: str
    zip_code: str
    city: str


class OrderRequestSerializer(BaseModel):
    customer_name: str
    customer_shipping_info: ShippingInfo
    customer_phone: str
    customer_email: str
    payment_method: PaymentInfo
    products: dict[int, int]  # dict[product_id: quantity]

class ProductCreate(BaseModel):
    name: str
    ean_code: int
    category_id: int
    supplier_id: int
    description: str
    public_unit_price: int
    supplier_unit_price: int
    img_link: str
    reorder_level: int
    metadata: dict

class ProductUpdate(BaseModel):
    product_id: int
    name: str | None = None
    ean_code: int | None = None
    category_id: int | None = None
    supplier_id: int | None = None
    description: str | None = None
    public_unit_price: int | None = None
    supplier_unit_price: int | None = None
    ig_link: str | None = None
    reorder_level: int | None = None
    metadata: dict | None = None