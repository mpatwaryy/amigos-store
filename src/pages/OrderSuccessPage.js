// src/pages/OrderSuccessPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function OrderSuccessPage() {
  // grab the orderId from the URL: /success?orderId=abc123
  const params = new URLSearchParams(useLocation().search);
  const orderId = params.get("orderId");

  return (
    <div
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        className="text-white text-center"
        style={{ backgroundColor: "rgba(0,0,0,0.75)", padding: "2rem", borderRadius: 8 }}
      >
        <h1>Thank you for your order!</h1>
        <p>Your order ID is:</p>
        <h4 className="my-3">{orderId}</h4>
        <Link to="/shop">
          <Button variant="light">Back to Shopping</Button>
        </Link>
      </Container>
    </div>
  );
}