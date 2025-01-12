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
