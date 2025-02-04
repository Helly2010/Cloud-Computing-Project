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
    console.log("Cart data:", cart); // Debugging line to check cart structure
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
              <Row>
                <Col md={2}>
                  <Image src={prod.img_link} alt={prod.name} fluid rounded />
                </Col>
                <Col md={2}>
                  <span>{prod.name}</span>
                </Col>
                <Col md={2}>{prod.formatted_price}</Col>
                <Col md={2}>
                  <Rating rating={prod.ratings || 0} onClick={() => {}}></Rating>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    value={prod.qty}
                    max={prod.stock.quantity}
                    min={1}
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
                <Col md={2}>
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
              <Link to="/checkout" state={{ total: Number((total / 100).toFixed(2))}}>
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
