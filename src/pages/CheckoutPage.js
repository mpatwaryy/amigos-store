// src/pages/CheckoutPage.js

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RJK8g4E6VMAUPzZy05zTwG3ebjbg7vAErcOUGjHnWreQP6sVhqObpnc1lPQDOWsgF2NRlaMyek22BCyQ4CK8QmG00QbCrnKw4"
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Form state (unchanged)
  const [formData, setFormData] = useState({
    name: "", email: "", address: "", city: "", state: "", zip: "",
    cardNumber: "", expiryDate: "", cvc: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const taxRate = 0.07, shippingFee = 5.99;

  // Calculate totals (unchanged)
  useEffect(() => {
    if (!cart.length) return setSubtotal(0), setTotal(0);
    const sub = cart.reduce((acc, item) =>
      acc + parseFloat(String(item.price).replace("$", "")) * (item.quantity||1), 0
    );
    setSubtotal(sub);
    setTotal(discountApplied ? 1 : sub + sub * taxRate + shippingFee);
  }, [cart, discountApplied]);

  // Apply discount (unchanged)
  const handleDiscountApply = () => {
    if (discountCode === "6969") setDiscountApplied(true);
    else alert("Invalid discount code.");
  };

  // **New**: handle form change (unchanged)
  const handleInputChange = e => {
    const {name,value} = e.target;
    setFormData(f=>({...f,[name]:value}));
  };

  // **New**: On mount, check for Stripe session success
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const session_id = params.get("session_id");
    if (!session_id) return;
    // Save order after successful payment
    (async () => {
      try {
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          email: formData.email,
          name: formData.name,
          shippingInfo: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
          orderDate: serverTimestamp(),
          status: "Pending",
          stripeSessionId: session_id,
        });
        clearCart();
        navigate("/orders");
      } catch (e) {
        console.error("Error saving order:", e);
      }
    })();
  }, [location.search]);

  // **New**: replace your handleSubmit with this:
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setErrorMessage("Please log in first.");
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const stripe = await stripePromise;
      // Call our serverless function
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          items: cart,
          shippingInfo: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          userId: user.uid,
        })
      });
      const {id: sessionId} = await res.json();
      // Redirect to Stripe Checkout
      const {error} = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setErrorMessage("Payment failed: " + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <Container className="mt-5 text-white">
      <h2 className="text-center mb-4">Checkout</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* Your original form fields unchanged */}
      <Form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        {/* name, email, address, city, state, zip */}
        {["name","email","address","city","state","zip"].map(key => (
          <Form.Group className="mb-3" key={key}>
            <Form.Label>{key.charAt(0).toUpperCase()+key.slice(1)}</Form.Label>
            <Form.Control
              type={ key==="email"?"email":"text" }
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        ))}

        <h5 className="mt-4">Order Summary</h5>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax (7%): ${(subtotal*taxRate).toFixed(2)}</p>
        <p>Shipping: ${shippingFee.toFixed(2)}</p>

        <Form.Group className="mb-3">
          <Form.Label>Discount Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter discount code"
            value={discountCode}
            onChange={e=>setDiscountCode(e.target.value)}
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleDiscountApply}>Apply Discount</Button>

        <h4 className="fw-bold mt-3">Total: ${total.toFixed(2)}</h4>

        {/* Remove cardNumber/expiry/CVC fields entirely */}

        <Button
          variant="light"
          type="submit"
          className="w-100 fw-bold mt-3"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed to Payment"}
        </Button>
      </Form>
    </Container>
  );
};

export default CheckoutPage;