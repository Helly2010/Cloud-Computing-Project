import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CartState } from "../context/CartContext";
import Filters from "./Filters";
import products from "../data/products";
import SingleProduct from "./SingleProduct";
import "./styles.css";

const Home = () => {
  const {
    productFilterState: { sort, byStock, byFastDelivery, byRating, searchQuery },
  } = CartState();

  //const [productList] = useState(products);

  //const [products, setProducts] = useState([]);

  /*useEffect(() => {
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

  /**
   * @returns filtered products
   */
  const transformProducts = (sortedProducts) => {
    if (sort) {
      //sort the products if sort = true
      sortedProducts = sortedProducts.sort((a, b) => (sort === "lowToHigh" ? a.price - b.price : b.price - a.price));
    }

    // if (!byStock) {
    //   sortedProducts = sortedProducts.filter((prod) => prod.inStock);
    // }

    // if (byFastDelivery) {
    //   sortedProducts = sortedProducts.filter((prod) => prod.fastDelivery);
    // }

    // if (byRating) {
    //   sortedProducts = sortedProducts.filter((prod) => prod.ratings === byRating);
    // }

    if (searchQuery) {
      sortedProducts = sortedProducts.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sortedProducts;
  };
  console.log(products)
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
