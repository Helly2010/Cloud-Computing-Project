import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../services/api/products";
import { CartState } from "../context/CartContext";
import { toast } from "react-toastify";
import "../styles/ProductDetails.css";

const notifySuccess = (
  message //success notification on adding / removing product from the cart
) =>
  toast.success(message, {
    position: "top-left",
    autoClose: 1500,
    closeOnClick: true,
  });
const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    state: { cart },
    dispatch,
  } = CartState();

  useEffect(() => {
    if (id !== undefined) {
      fetchProduct(id).then((p) => {
        setProduct(p);
        setLoading(false);
      });
    }
  }, [id]);

  if (!product && !loading) {
    return (
      <div className="container my-5">
        <h2 className="text-center">Product not found</h2>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <div className="product-details-page">
          <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", paddingTop: "80px" }} // Adjust for the header height
          >
            <div
              className="card shadow-lg"
              style={{
                maxWidth: "900px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div className="row g-0">
                {/* Left Column: Product Image */}
                <div className="col-md-6">
                  <img
                    src={product.img_link}
                    alt={product.name}
                    className="img-fluid"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain", // Ensures the entire image is visible
                      backgroundColor: "#eaeaea",
                    }}
                  />
                </div>

                {/* Right Column: Product Details */}
                <div
                  className="col-md-6 p-4 d-flex flex-column justify-content-between"
                  style={{
                    minHeight: "300px", // Ensures sufficient height for smaller screens
                    flexGrow: 1,
                  }}
                >
                  {/* Product Info */}
                  <div>
                    <h2 className="mb-3">{product.name}</h2>
                    <p className="text-muted">{product.description}</p>
                    <hr />
                    <p className="mb-2">
                      <strong>Price:</strong> <span className="text-success">{product.formatted_price}</span>
                    </p>
                    <p className="mb-2">
                      <strong>Category:</strong> {product.category.name}
                    </p>
                    <p className="mb-2">
                      <strong>Rating:</strong> {product.extra_info.rating} / 5
                    </p>
                    <p className="mb-2">
                      <strong>Stock:</strong> {product.stock.quantity} items available
                    </p>
                    <p>
                      <strong>Fast Delivery:</strong> {product.extra_info.fast_delivery ? "Yes" : "No"}
                    </p>
                  </div>

                  {cart.some((p) => p.id === product.id) ? (
                    <Button
                      onClick={() => {
                        dispatch({
                          type: "REMOVE_FROM_CART",
                          payload: product,
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
                        dispatch({
                          type: "ADD_TO_CART",
                          payload: product,
                        });
                        notifySuccess("Item added successfully");
                      }}
                      disabled={!product.stock.quantity > 0}
                      style={{ fontSize: "0.9rem" }}
                    >
                      {product.stock.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;