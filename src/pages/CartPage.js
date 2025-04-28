// src/pages/CartPage.js
import React, { useContext } from "react";
import { Container, Button, ListGroup } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <ListGroup className="mt-3">
          {cart.map((item) => (
            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center bg-dark text-white">
              <div>
                {item.img && <img src={item.img} alt={item.name} width="50" className="me-3" />}
                <span>{item.name} - ${item.price}</span>
              </div>
              <div className="d-flex align-items-center">
                <Button variant="light" size="sm" onClick={() => removeFromCart(item.id)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="light" size="sm" onClick={() => addToCart(item)}>+</Button>
              </div>
              <span>
                ${(
                  parseFloat(String(item.price).replace("$", "")) * item.quantity
                ).toFixed(2)}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <div className="text-center mt-4">
        <Link to="/checkout">
          <Button variant="success">Proceed to Checkout</Button>
        </Link>
      </div>
    </Container>
  );
};

export default CartPage;
