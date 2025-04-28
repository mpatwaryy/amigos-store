// src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const { login, user }         = useContext(AuthContext);
  const navigate                = useNavigate();
  const auth                    = getAuth();

  useEffect(() => {
    if (user) {
      user.role === "admin" ? navigate("/admin") : navigate("/orders");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fu   = cred.user;
      const name = fu.displayName?.split(" ")[0] || "User";
      const role = fu.email === "patcher787@gmail.com" ? "admin" : "customer";
      login({ firstName: name, email: fu.email, uid: fu.uid, role });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize:   "cover",
        backgroundPosition: "center",
        minHeight:        "100vh",
        display:          "flex",
        alignItems:       "center",
        justifyContent:   "center",
      }}
    >
      <Container
        className="text-white"
        style={{
          maxWidth:       "400px",
          backgroundColor: "rgba(0,0,0,0.75)",
          padding:         "2rem",
          borderRadius:    "8px",
        }}
      >
        <h2 className="mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="light" disabled={loading} className="w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </Form>
        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white">
            Sign Up
          </Link>
        </p>
      </Container>
    </div>
  );
};

export default LoginPage;