import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { CartState } from "../context/CartContext";
import Rating from "./Rating";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContextProvider";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom"; 
import useCategories from "../hooks/useCategories";
import useStock from "../hooks/useStock";

const SingleProduct = ({ prod }) => {
  //getting a product object as a prop
  //getting the cart from state, and the dispatch function
  const {
    state: { cart },
    dispatch,
  } = CartState();

  const { theme } = useTheme();
  const navigate = useNavigate(); 
  const { stock, loading, error } = useStock(prod.id); // Fetch stock using the hook
  const handleClick = () => {
    navigate(`/product/${prod.id}`); // Navigate to the product detail page
  };

  const notifySuccess = (
    message //success notification on adding / removing product from the cart
  ) =>
    toast.success(message, {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });

  const categories = useCategories(); // Fetch products using the custom hook

  return (
    <>
      <div className="product">
        <Card>
          <Card.Img variant="top" src={prod.image} alt={prod.name} onClick={() => navigate(`/product/${prod.id}`)}
          style={{ cursor: "pointer" }}/>
          <Card.Body className={`${theme === "light" ? "lightCard" : "darkCard"}`}>
            <Card.Title>{prod.name}</Card.Title>
            <Card.Subtitle style={{ paddingBottom: 10 }}>
              <span style={{ fontSize: "1.2rem" }}>
                &#8364; {/* EUR */} {prod.public_unit_price / 100}
              </span>
              <p>
                Category: {categories.find(obj => obj.id === prod.category_id)?.name || "Unknown"}
              </p>
              <p>Description: {prod.description}</p>
              {/* {prod.fastDelivery ? (
                <div>Fast Delivery</div>
              ) : (
                <div>10 days delivery</div>
              )}
              <Rating rating={prod.ratings} /> */}
            </Card.Subtitle>
            {/**
             * The Array.some() method checks if any of the elements in an array pass a test (provided as a function).
             * here the test is p.id === prod.id
             * so basically, here cart.some() returns true if the current product is present in the cart
             */}
            {cart.some((p) => p.id === prod.id) ? (
              <Button
                onClick={() => {
                  dispatch({
                    //passes type and payload
                    type: "REMOVE_FROM_CART",
                    payload: prod, //product that is currently being rendered
                  });
                  notifySuccess("Item removed successfully");
                }}
                variant="danger"
                style={{ fontSize: "0.9rem" }}
              >
                Remove from cart
              </Button>
            ) : (
              <Button
              onClick={() => {
                if (stock > 0) {
                  dispatch({
                    type: "ADD_TO_CART",
                    payload: prod, // Adds the product to the cart
                  });
                  notifySuccess("Item added successfully");
                }
              }}
              disabled={loading || stock <= 0} // Disable button if loading or out of stock
              style={{ fontSize: "0.9rem" }}
            >
              {loading ? "Loading..." : stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default SingleProduct