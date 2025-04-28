import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock_quantity: "",
  });

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      ...form,
      price: parseFloat(form.price),
      stock_quantity: parseInt(form.stock_quantity)
    });
    fetchProducts();
    setForm({ name: "", price: "", category: "", description: "", stock_quantity: "" });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="m-2 p-1"
            required
          />
        ))}
        <button type="submit" className="btn btn-light m-2">Add Product</button>
      </form>
      <h4 className="mt-4">Product List</h4>
      <ul>
        {products.map(prod => (
          <li key={prod.id}>{prod.name} - ${prod.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;