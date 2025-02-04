import { toast } from "react-toastify";
import EnvManager from "../../config/envManager";

const BASE_URL = EnvManager.BACKEND_URL;

const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories/`);

  if (!response.ok) {
    toast.error("Error while loading categories", {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });
    return;
  }

  const categories = await response.json();
  return categories;
};

export { fetchCategories };
