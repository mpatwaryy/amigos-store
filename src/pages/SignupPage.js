// src/pages/SignupPage.js
import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with the displayName
      await updateProfile(user, { displayName: firstName });

      // Save additional user data in Firestore via AuthContext
      await signup({ firstName, email, uid: user.uid });

      // Navigate to orders page upon success
      navigate("/orders");
    } catch (err) {
      console.error("Signup error:", err);
      // Show the detailed error message for debugging purposes
      setError("Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 text-white">
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>
        <Button type="submit" variant="light" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
        </Button>
      </Form>
      <p className="mt-3">
        Already have an account? <Link to="/login" className="text-white">Login</Link>
      </p>
    </Container>
  );
};

export default SignupPage;
