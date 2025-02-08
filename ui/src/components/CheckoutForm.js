import { PayPalButtons } from "@paypal/react-paypal-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useCallback, useState } from "react";
import { Card, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartState } from "../context/CartContext";
import { useTheme } from "../context/ThemeContextProvider";
import { createOrder } from "../services/api/orders";
import "./checkoutStyles.css";

const validateOrderData = (orderData) => {
  return orderData;
};

const CheckoutForm = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

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

  const {
    state: { cart },
    dispatch,
  } = CartState();

  const total = cart.reduce((acc, curr) => {
    const validPrice = Number(curr.public_unit_price) || 0;
    return acc + validPrice * curr.qty;
  }, 0);

  const createOrderCallback = useCallback(
    (provider, last4) => {
      const validOrderData = validateOrderData(orderData);

      if (!validOrderData) {
        toast.error(`Invalid Order Data`, {
          position: "top-left",
          autoClose: 1500,
          closeOnClick: true,
        });
        return;
      }

      createOrder({ ...validOrderData, paymentProvider: provider, last4 }, cart).then((order) => {
        if (!order) {
          toast.error(`Error while creating your order`, {
            position: "top-left",
            autoClose: 1500,
            closeOnClick: true,
          });
          return;
        }

        toast.info(`Order succesfully placed!`, {
          position: "top-left",
          autoClose: 1500,
          closeOnClick: true,
        });

        setTimeout(() => {
          dispatch({ type: "EMPTY_CART" });
          navigate("/");
        }, 10000);
      });
    },
    [orderData, cart, dispatch, navigate]
  );

  const onCreatePaypalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: `${(total / 100).toFixed(2)}`,
          },

          shipping: {
            type: "SHIPPING",
            name: {
              full_name: orderData.name,
            },
            email_address: orderData.email,
            phone_number: {
              country_code: "49",
              national_number: orderData.phone,
            },
            address: {
              address_line_1: orderData.street,
              admin_area_2: orderData.city,
              postal_code: orderData.zipCode,
              country_code: "DE",
            },
          },
        },
      ],
    });
  };

  const handlePayPalApprove = (data, actions) => {
    actions.order.capture().then((details) => {
      createOrderCallback("PAYPAL");
    });
  };

  const handlePayPalError = (err) => {
    console.log("PayPal Error: ", err);
    toast.error("Error while creating paypal order", {
      position: "top-left",
      autoClose: 1500,
      closeOnClick: true,
    });
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
      createOrderCallback("STRIPE", paymentMethod.card.last4);

      setError(null);
      setProcessing(false);
    }
  };

  return (
    <div className="checkoutPage">
      <div className="checkoutProductReview">
        <Card.Title>Your Order</Card.Title>

        <br></br>
        <ListGroup>
          {cart.map((prod) => (
            <ListGroup.Item key={prod.id}>
              <Row className="align-items-center justify-content-around">
                <Col style={{ maxWidth: "20vw", maxHeight: "20vh" }}>
                  <Image
                    style={{ maxWidth: "15vw", maxHeight: "20vh" }}
                    src={prod.img_link}
                    alt={prod.name}
                    fluid
                    rounded
                  />
                </Col>
                <Col className="text-center">
                  <span>{prod.name}</span>
                </Col>
                <Col className="text-center">{prod.qty}</Col>
                <Col className="text-center">{prod.formatted_price}</Col>
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
      <br />
      <Form className="checkoutForm">
        <Card.Title>Shipping & Payment Information</Card.Title>
        <br></br>
        <Row>
          <Col sm={8}>
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
                <div className="form-row">
                  <label style={{ color: theme === "light" ? "black" : "white" }}>City</label>
                  <input
                    className="cardInput"
                    type="text"
                    name="city"
                    value={orderData.city}
                    onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                    required
                  />
                </div>
              </Col>

              <Col>
                <div className="form-row">
                  <label style={{ color: theme === "light" ? "black" : "white" }}>Zipcode</label>
                  <input
                    className="cardInput"
                    type="number"
                    name="zipcode"
                    value={orderData.zipCode}
                    onChange={(e) => setOrderData({ ...orderData, zipCode: e.target.value })}
                    required
                  />
                </div>
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
        <div className="justify-content-center" style={{ display: "flex" }}>
          <div className="payment-methods">
            <PayPalButtons
              style={{
                layout: "vertical",
                shape: "pill",
                color: "blue",
              }}
              onApprove={handlePayPalApprove}
              onError={handlePayPalError}
              createOrder={onCreatePaypalOrder}
              disabled={cart.length === 0}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CheckoutForm;
