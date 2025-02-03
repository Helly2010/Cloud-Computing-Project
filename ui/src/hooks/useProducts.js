import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useCategories from "./useCategories"; // Import the useCategories hook

const useProducts = (done = () => {}) => {
  const [products, setProducts] = useState([]);
  const categories = useCategories(); // Fetch categories using the useCategories hook


  useEffect(() => {
    fetch("http://localhost:8000/products/").then((response) => {
      if (!response.ok) {
        toast.error("Error while loading products", {
          position: "top-left",
          autoClose: 1500,
          closeOnClick: true,
        });
        return;
      }

      return response.json().then((data) => {
        setProducts(data);
      });
    })
    .catch((error) => {
      toast.error("Error fetching products", {
        position: "top-left",
        autoClose: 1500,
        closeOnClick: true,
      });
    });
  }, [categories]);

  return products;
};

export default useProducts;
