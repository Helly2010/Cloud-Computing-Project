import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useProducts = () => {
  const [products, setProducts] = useState([]);

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
    });
  }, []);

  return products;
};

export default useProducts;