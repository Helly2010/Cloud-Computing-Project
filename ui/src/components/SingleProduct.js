import React from "react"; // React import
import { Button, Card } from "react-bootstrap"; // Importing Button and Card from react-bootstrap
import { toast } from "react-toastify"; // Toast for notifications
import { useNavigate } from "react-router-dom"; // For navigation
import { CartState } from "../context/CartContext"; // Cart state context
import { useTheme } from "../context/ThemeContextProvider"; // Theme context
import useStock from "../hooks/useStock"; // Custom hook for stock
import useCategories from "../hooks/useCategories"; // Custom hook for categories
import "react-toastify/dist/ReactToastify.css"; // Toast styles

const SingleProduct = ({ prod }) => {
  const {
    state: { cart },
    dispatch,
  } = CartState();

  const { theme } = useTheme();
  const navigate = useNavigate();

  // Fetch stock using the custom hook
  const { stockData, loading, error } = useStock(prod.id); // Get the stockData object
  const stock = stockData?.[prod.id] ?? 0; // Extract stock for the current product ID, default to 0 if undefined

  const handleClick = () => {
    navigate(`/product/${prod.id}`); // Navigate to the product detail page
  };

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });

  const categories = useCategories(); // Fetch categories using the custom hook

  return (
    <div className="product">
      <Card>
        <Card.Img
          variant="top"
          src={prod.img_link}
          alt={prod.name}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        />
        <Card.Body
          className={`${theme === "light" ? "lightCard" : "darkCard"}`}
        >
          <Card.Title>{prod.name}</Card.Title>
          <Card.Subtitle style={{ paddingBottom: 10 }}>
            <span style={{ fontSize: "1.2rem" }}>
              &#8364; {/* EUR */} {prod.public_unit_price / 100}
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
              Remove from Cart
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (stock > 0) {
                  dispatch({
                    type: "ADD_TO_CART",
                    payload: prod,
                  });
                  notifySuccess("Item added successfully");
                }
              }}
              disabled={loading || stock <= 0}
              style={{ fontSize: "0.9rem" }}
            >
              {loading ? "Loading..." : stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SingleProduct;
