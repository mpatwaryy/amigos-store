// src/pages/CheckoutPage.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const taxRate = 0.07; // 7% tax
  const shippingFee = 5.99; // Flat shipping fee

  useEffect(() => {
    if (cart && cart.length > 0) {
      const calculatedSubtotal = cart.reduce((acc, item) => {
        // Convert item.price to a string before using replace
        const numericPrice = parseFloat(String(item.price).replace("$", ""));
        return acc + numericPrice * (item.quantity || 1);
      }, 0);
      setSubtotal(calculatedSubtotal);
      updateTotal(calculatedSubtotal, discountApplied);
    } else {
      setSubtotal(0);
      setTotal(0);
    }
  }, [cart, discountApplied]);

  const updateTotal = (subtotalAmount, isDiscountApplied) => {
    const taxAmount = subtotalAmount * taxRate;
    let finalTotal = subtotalAmount + taxAmount + shippingFee;
    if (isDiscountApplied) {
      finalTotal = 1; // Discounted total (for example)
    }
    setTotal(finalTotal);
  };

  const sendEmailConfirmation = (orderId, email) => {
    alert(`Order #${orderId} has been placed! A confirmation email has been sent to ${email}.`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscountApply = () => {
    if (discountCode === "6969") {
      setDiscountApplied(true);
    } else {
      alert("Invalid discount code.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    const validCardNumber = "4242424242424242";
    const validExpiry = "12/25";
    const validCVC = "123";

    if (
      formData.cardNumber.replace(/\s/g, "") !== validCardNumber ||
      formData.expiryDate !== validExpiry ||
      formData.cvc !== validCVC
    ) {
      setErrorMessage("Invalid card details. Please try again.");
      setIsProcessing(false);
      return;
    }

    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user ? user.uid : null,
        email: formData.email,
        name: formData.name,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
        shippingInfo: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        orderDate: serverTimestamp(),
        status: "Pending",
      });
      clearCart();
      sendEmailConfirmation(orderRef.id, formData.email);
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setErrorMessage("Failed to place order. Please try again. (" + error.message + ")");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="mt-5 text-white">
      <h2 className="text-center mb-4">Checkout</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Shipping Address</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" name="city" value={formData.city} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" name="state" value={formData.state} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ZIP Code</Form.Label>
          <Form.Control type="text" name="zip" value={formData.zip} onChange={handleInputChange} required />
        </Form.Group>
        <h5 className="mt-4">Order Summary</h5>
        <p className="fw-bold">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="fw-bold">Tax (7%): ${(subtotal * taxRate).toFixed(2)}</p>
        <p className="fw-bold">Shipping: ${shippingFee.toFixed(2)}</p>
        <Form.Group className="mb-3">
          <Form.Label>Discount Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </Form.Group>
        <Button variant="secondary" className="mb-3" onClick={handleDiscountApply}>
          Apply Discount
        </Button>
        <h4 className="fw-bold mt-3">Total: ${total.toFixed(2)}</h4>
        <h5 className="mt-3">Payment Details</h5>
        <Form.Group className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="Enter a 16-digit card number"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Expiry Date (MM/YY)</Form.Label>
          <Form.Control
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>CVC</Form.Label>
          <Form.Control
            type="text"
            name="cvc"
            value={formData.cvc}
            onChange={handleInputChange}
            placeholder="CVC"
            required
          />
        </Form.Group>
        <Button variant="light" type="submit" className="w-100 fw-bold" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </Form>
    </Container>
  );
};

export default CheckoutPage;
