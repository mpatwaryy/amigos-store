// src/components/SearchOverlay.js
import React, { useContext, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 
import { SearchContext } from "../context/SearchContext";

const SearchOverlay = ({ isOpen, onClose }) => {
  const { setSearchTerm } = useContext(SearchContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate(); // 

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(input);
    onClose();
    navigate("/shop"); // 
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchOverlay;
