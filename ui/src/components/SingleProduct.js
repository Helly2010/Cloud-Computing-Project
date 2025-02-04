import React from "react"; // React import
import { Button, Card } from "react-bootstrap"; // Importing Button and Card from react-bootstrap
import { toast } from "react-toastify"; // Toast for notifications
import { useNavigate } from "react-router-dom"; // For navigation
import { CartState } from "../context/CartContext"; // Cart state context
import { useTheme } from "../context/ThemeContextProvider"; // Theme context
import "react-toastify/dist/ReactToastify.css"; // Toast styles

const SingleProduct = ({ prod }) => {
  const {
    state: { cart },
    dispatch,
  } = CartState();

  const { theme } = useTheme();
  const navigate = useNavigate();


  const handleClick = () => {
    navigate(`/product/${prod.id}`); // Navigate to the product detail page
  };

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });


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
              {prod.formatted_price}
            </span>
            <p>
              {`Category: ${prod.category.name}`}
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
                if (prod.stock.quantity > 0) {
                  dispatch({
                    type: "ADD_TO_CART",
                    payload: prod,
                  });
                  notifySuccess("Item added successfully");
                }
              }}
              disabled={prod.stock.quantity <= 0}
              style={{ fontSize: "0.9rem" }}
            >
              {prod.stock.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SingleProduct;
