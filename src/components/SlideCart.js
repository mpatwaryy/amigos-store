// src/components/SlideCart.js
import React, { useContext } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const SlideCart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <Offcanvas show={isOpen} onHide={onClose} placement="end" className="bg-dark text-white">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>{item.name}</strong> x {item.quantity}
              </div>
              <Button variant="light" size="sm" onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </div>
          ))
        )}
        {cart.length > 0 && (
          <Link to="/checkout">
            <Button variant="success" onClick={onClose} className="w-100">
              Checkout
            </Button>
          </Link>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SlideCart;
