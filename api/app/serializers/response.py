from pydantic import BaseModel
from datetime import datetime


class OrderSerializer(BaseModel):
    id: int
    order_total: int
    customer_name: str
    customer_shipping_info: dict
    customer_phone: str
    customer_email: str
    payment_method: dict
    status: str
    updated_at: datetime
    created_at: datetime

class ProductSerializer(BaseModel):
    id: int 
    name: str
    ean_code: int 
    category_id: int
    supplier_id: int
    stock_id: int
    description: str
    public_unit_price: int
    supplier_unit_price: int
    img_link: str
    reorder_level: int
    extra_info: dict
    updated_at: datetime
    created_at: datetime