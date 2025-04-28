import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    console.log("Payment simulated!");
    alert("Payment Successful!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-dark text-white">
      <h3>Enter Payment Details</h3>
      <CardElement className="p-3 bg-light rounded" />
      <button type="submit" className="btn btn-success mt-4" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

export default PaymentForm;
