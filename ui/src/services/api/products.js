import { toast } from "react-toastify";
import EnvManager from "../../config/envManager";

const BASE_URL = EnvManager.BACKEND_URL;

const fetchProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/`);

    if (!response.ok) {
      toast.error("Error while loading products", {
        position: "top-left",
        autoClose: 1500,
        closeOnClick: true,
      });
      return;
    }

    const products = await response.json();
    return products;
  } catch (error) {
    toast.error("Error while loading products", {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });
    console.log(error);
    return;
  }
};

const fetchProduct = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
      toast.error("Error while loading products", {
        position: "top-left",
        autoClose: 1500,
        closeOnClick: true,
      });
      return [];
    }

    const product = await response.json();
    return product;
  } catch (error) {
    toast.error("Error while loading categories", {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });
    console.log(error);
    return [];
  }
};

export { fetchProducts, fetchProduct };
