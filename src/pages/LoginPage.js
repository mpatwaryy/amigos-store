// src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const auth = getAuth();

  // Redirect based on the user's role after login
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/orders");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;
      const firstName = firebaseUser.displayName ? firebaseUser.displayName.split(" ")[0] : "User";
      // Determine role based on the email
      const role = firebaseUser.email === "patcher787@gmail.com" ? "admin" : "customer";
      // Pass role along with the user data
      login({ firstName, email: firebaseUser.email, uid: firebaseUser.uid, role });
      // No need to navigate here; useEffect will handle redirection based on role.
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 text-white">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
        {error && <Alert variant="danger">{error}</Alert>}
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
          {loading ? <Spinner animation="border" size="sm" /> : "Login"}
        </Button>
      </Form>
      <p className="mt-3">
        Don't have an account?{" "}
        <Link to="/signup" className="text-white">
          Sign Up
        </Link>
      </p>
    </Container>
  );
};

export default LoginPage;