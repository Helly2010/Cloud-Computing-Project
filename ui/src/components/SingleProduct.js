import React from "react";
import { Button, Card } from "react-bootstrap";
import { CartState } from "../context/CartContext";
import { useTheme } from "../context/ThemeContextProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCategories from "../hooks/useCategories";

const SingleProduct = ({ prod, stockData, loading }) => {
  const {
    state: { cart },
    dispatch,
  } = CartState();

  const { theme } = useTheme();
  const navigate = useNavigate();

  // Safely check if stockData is available and access the product's stock data
  const stock = stockData && stockData[prod.id] ? stockData[prod.id] : 0; // Default to 0 if stock is not found

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });

  const categories = useCategories();

  const buttonText = loading
    ? "Loading..."
    : stock <= 0
    ? "Out of Stock"
    : "Add to Cart";

  const isDisabled = loading || stock <= 0;

  const handleAddToCart = () => {
    if (stock > 0) {
      dispatch({
        type: "ADD_TO_CART",
        payload: prod,
      });
      notifySuccess("Item added successfully");
    } else {
      console.log("Item is out of stock");
    }
  };

  return (
    <div className="product">
      <Card>
        <Card.Img
          variant="top"
          src={prod.image}
          alt={prod.name}
          onClick={() => navigate(`/product/${prod.id}`)}
          style={{ cursor: "pointer" }}
        />
        <Card.Body
          className={`${
            theme === "light" ? "lightCard" : theme === "dark" ? "darkCard" : ""
          }`}
        >
          <Card.Title>{prod.name}</Card.Title>
          <Card.Subtitle style={{ paddingBottom: 10 }}>
            <span style={{ fontSize: "1.2rem" }}>
              &#8364; {prod.public_unit_price / 100}
            </span>
            <p>
              Category:{" "}
              {categories.find((obj) => obj.id === prod.category_id)?.name ||
                "Unknown"}
            </p>
            <p>Description: {prod.description}</p>
          </Card.Subtitle>

          {cart.some((p) => p.id === prod.id) ? (
            <Button
              onClick={() => {
                dispatch({
                  type: "REMOVE_FROM_CART",
                  payload: prod,
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
              onClick={handleAddToCart}
              disabled={isDisabled}
              style={{ fontSize: "0.9rem" }}
            >
              {buttonText}
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SingleProduct;
