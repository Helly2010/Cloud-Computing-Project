import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import products from "../data/products"; // Your static data

const ProductDetail = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find((prod) => prod.id === parseInt(id)); // Find product by ID
    console.log("Found product:", foundProduct);
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="productDetail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: &#8364;{product.price.toFixed(2)}</p>
      <p>Category: {product.category}</p>
      <p>Rating: {product.ratings}</p>
      <p>Stock: {parseInt(product.inStock)} items available</p>
      <p>Fast Delivery: {product.fastDelivery ? "Yes" : "No"}</p>
    </div>
  );
};

export default ProductDetail;
