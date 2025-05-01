// src/pages/CheckoutPage.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const stripePromise = loadStripe(
  "pk_test_51RJK8g4E6VMAUPzZy05zTwG3ebjbg7vAErcOUGjHnWreQP6sVhqObpnc1lPQDOWsgF2NRlaMyek22BCyQ4CK8QmG00QbCrnKw4"
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "", email: "", address: "", city: "", state: "", zip: ""
  });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // turn "$29.99" or number into a float
  const getPrice = p =>
    typeof p === "number"
      ? p
      : parseFloat(String(p).replace(/[^0-9.-]+/g, ""));

  // cart total
  const totalAmount = cart.reduce(
    (sum, i) => sum + getPrice(i.price) * (i.quantity || 1),
    0
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return setError("Please log in first.");
    if (!cart.length) return setError("Your cart is empty.");

    setProcessing(true);
    setError("");

    try {
      // 1) record order in Firestore
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        ...formData,
        items: cart.map(i => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity || 1,
          price: getPrice(i.price),
        })),
        totalAmount,
        orderDate: serverTimestamp(),
        status: "Pending",
      });

      // 2) create Stripe Checkout Session via our API
      const stripe = await stripePromise;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shippingInfo: formData,
          userId: user.uid,
          orderId: orderRef.id,
        }),
      });
      const { id: sessionId } = await res.json();

      // 3) redirect to Stripe
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Checkout failed:", err);
      setError("Checkout failed: " + err.message);
      setProcessing(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "3rem 1rem",
      }}
    >
      <Container
        className="bg-dark text-white p-4 rounded"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <h2 className="text-center mb-4">Checkout</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {["name","email","address","city","state","zip"].map(key => (
            <Form.Group className="mb-3" controlId={key} key={key}>
              <Form.Label>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Form.Label>
              <Form.Control
                type={key === "email" ? "email" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}

          <h5 className="mt-4">Order Summary</h5>
          {cart.map(i => (
            <div
              key={i.id}
              className="d-flex justify-content-between bg-secondary text-white p-2 my-1 rounded"
            >
              <span>{i.name} × {i.quantity || 1}</span>
              <span>${(getPrice(i.price) * (i.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <strong>Total:</strong>
            <strong>${totalAmount.toFixed(2)}</strong>
          </div>

          <Button
            variant="light"
            type="submit"
            className="w-100 mt-4"
            disabled={processing}
          >
            {processing ? "Redirecting..." : "Proceed to Payment"}
          </Button>
        </Form>
      </Container>
    </div>
  );
}
