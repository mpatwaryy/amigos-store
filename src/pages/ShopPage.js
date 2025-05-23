// src/pages/ShopPage.js
import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const ShopPage = () => {
  const { addToCart } = useContext(CartContext);
  const { searchTerm } = useContext(SearchContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <Container className="mt-2">
        <h1 className="text-center text-white mb-5">Shop Ole Miss Merchandise</h1>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="light" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <Row>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Col md={4} key={product.id} className="d-flex align-items-stretch">
                  <Card
                    className="mb-4 bg-dark text-white w-100"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.08) rotate(1deg)";
                      e.currentTarget.style.boxShadow = "0px 12px 24px rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {product.imageUrl && (
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          height: "250px",
                          width: "100%",
                          objectFit: "contain",
                          backgroundColor: "#fff",
                          padding: "10px",
                        }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>${product.price}</Card.Text>
                      </div>
                      <Button variant="light" onClick={() => addToCart(product)}>
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-white text-center">No products match your search.</p>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ShopPage;
