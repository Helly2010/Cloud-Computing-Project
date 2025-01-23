import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/categories/").then((response) => {
      if (!response.ok) {
        toast.error("Error while loading categories", {
          position: "top-left",
          autoClose: 1500,
          closeOnClick: true,
        });
        return;
      }

      return response.json().then((data) => {
        setCategories(data);
      });
    });
  }, [!categories]);

  return categories;
};

export default useCategories;