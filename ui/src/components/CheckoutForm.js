import { PayPalButtons } from "@paypal/react-paypal-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartState } from "../context/CartContext";
import { useTheme } from "../context/ThemeContextProvider";
import "./checkoutStyles.css";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    street: "",
    zipCode: "",
    city: "",
    phone: "",
  });

  const { theme } = useTheme();

  const navigate = useNavigate();
  const {
    state: { cart },
    dispatch,
  } = CartState();

  const total = cart.reduce((acc, curr) => {
    const validPrice = Number(curr.public_unit_price) || 0;
    return acc + validPrice * curr.qty;
  }, 0);

  // Create Order

  const onCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: `${total.toFixed(2)}`,
          },
        },
      ],
    });
  };

  // Handle PayPal approval
  const handlePayPalApprove = (data, actions) => {
    actions.order.capture().then((details) => {
      // Process the PayPal order on approval
      alert(`Transaction completed by ${details.payer.name.given_name}`);
      dispatch({ type: "EMPTY_CART" });
    });
  };

  // Handle PayPal error
  const handlePayPalError = (err) => {
    console.error("PayPal Error: ", err);
    alert("An error occurred while processing PayPal payment.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (elements == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      const { id } = paymentMethod;
      console.log(id);
      // Here, you can submit the payment method id to your server for processing the payment
      setError(null);
      setProcessing(false);
      alert("Payment succeeded with Stripe!");
      dispatch({ type: "EMPTY_CART" });
    }
  };

  return (
    <div className="checkoutPage">
      <form className="checkoutForm">
        <Card.Title>Shipping & Payment Information</Card.Title>
        <br></br>
        <Row>
          <Col>
            <div className="form-row">
              <label style={{ color: theme === "light" ? "black" : "white" }}>Name</label>
              <input
                className="cardInput"
                type="text"
                name="name"
                value={orderData.name}
                onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <label style={{ color: theme === "light" ? "black" : "white" }}>Email</label>
              <input
                className="cardInput"
                type="email"
                name="email"
                value={orderData.email}
                onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label style={{ color: theme === "light" ? "black" : "white" }}>Phone</label>
              <input
                className="cardInput"
                type="phone"
                name="phone"
                value={orderData.phone}
                onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                required
              />
            </div>
          </Col>

          <Col>
            <Row>
              <div className="form-row">
                <label style={{ color: theme === "light" ? "black" : "white" }}>Address</label>
                <input
                  className="cardInput"
                  type="text"
                  name="address"
                  value={orderData.street}
                  onChange={(e) => setOrderData({ ...orderData, street: e.target.value })}
                  required
                />
              </div>
            </Row>
            <Row>
              <Col>
                <label style={{ color: theme === "light" ? "black" : "white" }}>City</label>
                <input
                  className="cardInput"
                  type="text"
                  name="city"
                  value={orderData.city}
                  onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                  required
                />
              </Col>

              <Col>
                <label style={{ color: theme === "light" ? "black" : "white" }}>Zipcode</label>
                <input
                  className="cardInput"
                  type="number"
                  name="zipcode"
                  value={orderData.zipCode}
                  onChange={(e) => setOrderData({ ...orderData, zipCode: e.target.value })}
                  required
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Stripe Payment */}
        <div className="form-row">
          <label htmlFor="card-element" style={{ color: theme === "light" ? "black" : "white" }}>
            Card information
          </label>
          <div id="cardElement">
            <CardElement hidePostalCode />
          </div>
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
          {/* Stripe Payment Submit Button */}
          <button type="submit" disabled={processing || cart.length === 0} onClick={handleSubmit}>
            {processing ? "Processing..." : "Pay with Stripe"}
          </button>
        </div>

        {/* PayPal Button */}
        <div className="payment-methods">
          <PayPalButtons
            style={{
              layout: "vertical",
              shape: "pill",
              color: "blue",
            }}
            onApprove={handlePayPalApprove}
            onError={handlePayPalError}
            createOrder={onCreateOrder}
          />
        </div>
      </form>
      <br></br>
      <div className="checkoutProductReview">
        <Card.Title>Your Order</Card.Title>
        <br></br>
        <ListGroup>
          {cart.map((prod) => (
            <ListGroup.Item key={prod.id}>
              <Row>
                <Col md={3} style={{ maxWidth: "20vw", maxHeight: "20vh" }}>
                  <Image src={prod.img_link} alt={prod.name} fluid rounded />
                </Col>
                <Col md={3}>
                  <span>{prod.name}</span>
                </Col>
                <Col md={3}>{prod.formatted_price}</Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <Card style={{ marginTop: "0.5em" }}>
          <Card.Body>
            <Card.Text> SUBTOTAL: {(total / 100).toFixed(2)} &euro; </Card.Text>
            <Card.Text>Total items: {cart.length}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
