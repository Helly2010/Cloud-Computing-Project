import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProducts from "../hooks/useProducts"; // Import the custom hook
import "../styles/ProductDetails.css"; // Optional: For additional styling

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const products = useProducts(); // Fetch products using the custom hook
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Find the product based on the ID from the URL after the products are fetched
    const selectedProduct = products.find((prod) => prod.id === parseInt(id));
    setProduct(selectedProduct);
  }, [id, products]); // Re-run whenever the id or products change

  if (!product) {
    return (
      <div className="container my-5">
        <h2 className="text-center">Product not found</h2>
      </div>
    );
  }

  return (
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
                src={product.image}
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
                  <strong>Price:</strong>{" "}
                  <span className="text-success">€{product.priceEuro.toFixed(2)}</span>
                </p>
                <p className="mb-2">
                  <strong>Category:</strong> {product.categoryName}
                </p>
                <p className="mb-2">
                  <strong>Rating:</strong> {product.ratings} / 5
                </p>
                <p className="mb-2">
                  <strong>Stock:</strong> {product.inStock} items available
                </p>
                <p>
                  <strong>Fast Delivery:</strong>{" "}
                  {product.fastDelivery ? "Yes" : "No"}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button className="btn btn-success btn-lg mt-3">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;