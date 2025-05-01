import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const orderId = new URLSearchParams(useLocation().search).get("orderId");

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
        style={{
          maxWidth: "500px",
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: "3rem",
          borderRadius: "8px",
        }}
      >
        <h2>Thank you! 🎉</h2>
        <p>Your order has been placed successfully.</p>
        <p><strong>Order # {orderId}</strong></p>
        <Button variant="light" onClick={() => navigate("/orders")}>
          View My Orders
        </Button>
      </Container>
    </div>
  );
};

export default OrderSuccessPage;