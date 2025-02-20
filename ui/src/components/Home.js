import React, { useEffect, useState } from "react";
import { CartState } from "../context/CartContext";
import Filters from "./Filters";
import SingleProduct from "./SingleProduct";
import { fetchCategories } from "../services/api/categories";
import { fetchProducts } from "../services/api/products";
import "./styles.css";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts().then((p) => setProducts(p));
    fetchCategories().then((c) => setCategories(c));
    setLoading(false);
  }, []);

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
        ) : products ? (
          transformProducts(products).map((prod) => {
            return <SingleProduct key={prod.id} prod={prod} />;
          })
        ) : null}
      </div>
      <Filters categories={categories} />
    </div>
  );
};

export default Home;
