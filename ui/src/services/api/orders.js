import { toast } from "react-toastify";
import EnvManager from "../../config/envManager";

const BASE_URL = EnvManager.BACKEND_URL;

const createOrder = async (orderData, products) => {
  const body = JSON.stringify({
    customer_name: orderData.name,
    customer_shipping_info: {
      street: orderData.street,
      zip_code: orderData.zipCode,
      city: orderData.city,
    },
    customer_phone: `+49 ${orderData.phone}`,
    customer_email: orderData.email,
    payment_method: {
      credit_card_number: `***** ${orderData.last4}`,
      payment_provider: orderData.paymentProvider,
    },
    products: products.map((product) => ({ product_id: product.id, amount: product.qty })),
  });
  console.log(body);
  try {
    const response = await fetch(`${BASE_URL}/orders/`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      return null;
    }
    const order = await response.json();
    return order;
  } catch (error) {
    toast.error("Error while creating Order", {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });
    console.log(error);
    return null;
  }
};

export { createOrder };
