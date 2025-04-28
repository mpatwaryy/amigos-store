// src/pages/HomePage.js
import React from "react";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <motion.div
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        color: "white",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
    >
      <motion.div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          maxWidth: "600px",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.h1
          className="display-3"
          style={{ fontWeight: "bold" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          Welcome to Amigos Store
        </motion.h1>
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
        >
          Exclusive Merchandise for True Fans
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        >
          <Link to="/shop">
            <Button variant="light" size="lg" className="fw-bold mt-3 px-4 py-2">
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
