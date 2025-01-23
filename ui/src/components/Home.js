import React from "react";
import { CartState } from "../context/CartContext";
import Filters from "./Filters";
import SingleProduct from "./SingleProduct";
import useProducts from "../hooks/useProducts";
import "./styles.css";

const Home = () => {

  const products = useProducts(); // Fetch products using the custom hook

  const {
    productFilterState: { sort, byStock, byFastDelivery, byRating, searchQuery },
  } = CartState();

  /**
   * @returns filtered products
   */
  
  const transformProducts = (sortedProducts) => {
    // Apply sorting based on the 'sort' filter value (lowToHigh or highToLow)
    // If the 'sort' value is 'lowToHigh', it sorts the products by price in ascending order.
    // If the 'sort' value is 'highToLow', it sorts the products by price in descending order.
    if (sort) {
      sortedProducts = sortedProducts.sort((a, b) =>
        sort === "lowToHigh" ? a.price - b.price : b.price - a.price
      );
    }
  
    // Filter products by stock availability:
    // If 'byStock' is false, filter out products that are out of stock. 
    // This ensures only products that are available for purchase are shown.
    if (!byStock) {
      sortedProducts = sortedProducts.filter((prod) => prod.inStock);
    }
  
    // Filter products by fast delivery option:
    // If 'byFastDelivery' is true, filter to show only products that offer fast delivery.
    if (byFastDelivery) {
      sortedProducts = sortedProducts.filter((prod) => prod.fastDelivery);
    }
  
    // Filter products by rating:
    // If 'byRating' filter is specified (i.e., it's a non-zero value), 
    // only products with the specified rating will be displayed.
    if (byRating) {
      sortedProducts = sortedProducts.filter((prod) => prod.ratings === byRating);
    }
  
    // Filter products by search query:
    // If the 'searchQuery' is not empty, the function filters the products
    // based on the query. It matches the query with the product name or category (case-insensitive).
    if (searchQuery) {
      sortedProducts = sortedProducts.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||  // Matches query with product name
          prod.category.toLowerCase().includes(searchQuery.toLowerCase())  // Matches query with product category
      );
    }
  
    // Return the final list of filtered and sorted products based on all the applied filters.
    return sortedProducts;
  };
  
  return (
    <div className="home">
      <div className="productContainer">
        {transformProducts(products).map((prod) => {
          return <SingleProduct key={prod.id} prod={prod} />;
        })}
      </div>
      <Filters />
    </div>
  );
};

export default Home;

/**
 * The destructuring assignment syntax is a JavaScript expression
 * that makes it possible to unpack values from arrays, or properties
 * from objects, into distinct variables.
 */
