// src/App.js
import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import TrendingPage from "./pages/TrendingPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrderDetails from "./pages/OrderDetails";
import ProfilePage from "./pages/ProfilePage";
import CartProvider, { CartContext } from "./context/CartContext";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import SearchProvider, { SearchContext } from "./context/SearchContext"; // ✅ Added Search Context
import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import "@fontsource/poppins";
import SlideCart from "./components/SlideCart";
import SearchOverlay from "./components/SearchOverlay";
import "./App.css";

function NavigationBar({ setCartOpen, setSearchOpen }) {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { setSearchTerm } = useContext(SearchContext);
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  const handleSearchClick = () => {
    setSearchTerm(""); // Clear previous search
    setSearchOpen(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        AMIGOS
      </Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item">
            {!user ? (
              <Link className="btn btn-link text-white" to="/login">
                <FaUser size={20} />
              </Link>
            ) : (
              <span className="text-white me-3">
                Hi, {user.firstName || user.email?.split("@")[0]}
              </span>
            )}
          </li>
          <li className="nav-item">
            <button className="btn btn-link text-white" onClick={handleSearchClick}>
              <FaSearch size={20} />
            </button>
          </li>
          <li className="nav-item position-relative">
            <button className="btn btn-link text-white" onClick={() => setCartOpen(true)}>
              <FaShoppingCart size={20} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
          </li>
          {user && (
            <li className="nav-item">
              <button className="btn btn-link text-danger" onClick={logout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <CartProvider>
      <SearchProvider> {/* ✅ Wrap inside SearchProvider */}
        <Router>
          <motion.div className="bg-black text-white min-vh-100" style={{ fontFamily: "Poppins, sans-serif" }}>
            <NavigationBar setCartOpen={setCartOpen} setSearchOpen={setSearchOpen} />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/orders/:orderId" element={<OrderDetails />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            {cartOpen && <SlideCart isOpen={cartOpen} onClose={() => setCartOpen(false)} />}
            {searchOpen && <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
          </motion.div>
        </Router>
      </SearchProvider>
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
