import React, { useMemo, useState } from "react";
import { CartState } from "../context/CartContext";
import useProducts from "../hooks/useProducts";
import Filters from "./Filters";
import SingleProduct from "./SingleProduct";
import "./styles.css";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const loadingDone = useMemo(() => {
    setLoading(false);
  }, []);

  const products = useProducts(loadingDone);

  const {
    productFilterState: { sort, byStock, byFastDelivery, byRating, searchQuery, byCategory },
  } = CartState();

  const transformProducts = (sortedProducts) => {
    // Filter products by stock availability
    if (!byStock) {
      sortedProducts = sortedProducts.filter((prod) => prod.stock.quantity > 0);
    }

    // Filter products by fast delivery
    if (byFastDelivery) {
      sortedProducts = sortedProducts.filter((prod) => prod.extra_info.fast_delivery);
    }

    // Filter products by rating
    if (byRating) {
      sortedProducts = sortedProducts.filter((prod) => prod.extra_info.rating === byRating);
    }

    // Filter products by search query
    if (searchQuery) {
      sortedProducts = sortedProducts.filter((prod) => {
        return (
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Filter by Selected Category (Matching Category Name)
    if (byCategory) {
      sortedProducts = sortedProducts.filter((prod) => {
        return prod.category.name.toLowerCase() === byCategory.toLowerCase();
      });
    }

    if (sort) {
      sortedProducts = [...sortedProducts].sort((a, b) =>
        sort === "lowToHigh" ? a.public_unit_price - b.public_unit_price : b.public_unit_price - a.public_unit_price
      );
    }

    return sortedProducts;
  };

  return (
    <div className="home">
      <div className="productContainer">
        {loading ? (
          <div>Loading...</div>
        ) : (
          transformProducts(products).map((prod) => {
            return <SingleProduct key={prod.id} prod={prod} />;
          })
        )}
      </div>
      <Filters />
    </div>
  );
};

export default Home;
