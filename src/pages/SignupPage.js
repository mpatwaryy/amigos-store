// src/pages/SignupPage.js
import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const { signup }                = useContext(AuthContext);
  const navigate                  = useNavigate();
  const auth                      = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: firstName });
      await signup({ firstName, email, uid: cred.user.uid });
      navigate("/orders");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Signup failed: " + err.message);
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
        <h2 className="mb-4">Sign Up</h2>
        <Form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="light" disabled={loading} className="w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
          </Button>
        </Form>
        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-white">
            Login
          </Link>
        </p>
      </Container>
    </div>
  );
};

export default SignupPage;