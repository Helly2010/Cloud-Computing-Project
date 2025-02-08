import React, { useEffect, useState } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { CartState } from "../context/CartContext";
import Rating from "./Rating";
import Form from "react-bootstrap/Form";
import { AiFillDelete } from "react-icons/ai";
import { useTheme } from "../context/ThemeContextProvider";
import { Link } from "react-router-dom";

const Cart = () => {
  const { theme } = useTheme();
  const {
    state: { cart },
    dispatch,
    productFilterState: { searchQuery },
  } = CartState();

  const [total, setTotal] = useState(0); // Subtotal
  const [items, setItems] = useState(0); // Total items in the cart

  useEffect(() => {
    setTotal(
      cart.reduce((acc, curr) => {
        const validPrice = Number(curr.public_unit_price) || 0; // Fallback for invalid prices
        return acc + validPrice * curr.qty;
      }, 0)
    );
    setItems(cart.reduce((acc, curr) => acc + Number(curr.qty), 0));
  }, [cart]);

  const transformedProducts = () => {
    let products = cart;
    if (searchQuery) {
      products = products.filter((prod) => prod.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return products;
  };

  return (
    <div className="home flex-column">
      <div className={`productContainer ms-0 ${theme === "dark" && "darkBody"}`}>
        <ListGroup>
          {transformedProducts().map((prod) => (
            <ListGroup.Item key={prod.id}>
              <Row className="align-items-center justify-content-around">
                <Col md={2} style={{ maxWidth: "20vw", maxHeight: "20vh" }}>
                  <Image src={prod.img_link} alt={prod.name} fluid rounded />
                </Col>
                <Col md={2} className="text-center">
                  <span>{prod.name}</span>
                </Col>
                <Col md={2} className="text-center">{prod.formatted_price}</Col>
                <Col md={2} className="text-center">
                  <Rating rating={prod.extra_info.rating || 0} onClick={() => {}} />
                </Col>
                <Col md={2} className="text-center">
                  <Form.Control
                    type="number"
                    value={prod.qty}
                    max={prod.stock.quantity}
                    min={1}
                    onInput={(e) =>
                      (e.target.value =
                        !!e.target.value && Math.abs(e.target.value) >= 0 ? Math.abs(e.target.value) : 1)
                    }
                    onChange={(e) =>
                      dispatch({
                        type: "CHANGE_CART_QTY",
                        payload: {
                          id: prod.id,
                          qty: e.target.value,
                        },
                      })
                    }
                  />
                </Col>
                <Col md={2} className="text-center">
                  <Button
                    type="button"
                    variant="light"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: prod,
                      })
                    }
                  >
                    <AiFillDelete fontSize="20px" />
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      {cart.length > 0 ? (
        <div className="checkoutCard">
          <Card>
            <Card.Body>
              <Card.Title> SUBTOTAL: {(total / 100).toFixed(2)} &euro; </Card.Title>
              <Card.Text>Total items: {items}</Card.Text>
              <Link to="/checkout" state={{ total: Number((total / 100).toFixed(2)) }}>
                <Button variant="primary">Proceed to Checkout</Button>
              </Link>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <h4 style={{ textAlign: "center" }}>Cart is Empty!</h4>
      )}
    </div>
  );
};

export default Cart;
