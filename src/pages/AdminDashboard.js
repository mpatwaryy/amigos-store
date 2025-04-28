import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    stock_quantity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, currentStatus) => {
    // Determine next status
    const next =
      currentStatus === "Pending"
        ? "Shipped"
        : currentStatus === "Shipped"
        ? "Completed"
        : "Pending";
    if (!window.confirm(`Mark order ${orderId} as ${next}?`)) return;
    try {
      await updateDoc(doc(db, "orders", orderId), { status: next });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Add product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    if (!auth.currentUser) {
      console.error("Not signed in.");
      setUploading(false);
      return;
    }
    let imageUrl = "";
    if (imageFile) {
      const filename = `${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, `products/${filename}`);
      try {
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch (err) {
        console.error("Upload failed:", err);
        setUploading(false);
        return;
      }
    }
    try {
      await addDoc(collection(db, "products"), {
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity, 10),
        imageUrl,
        createdAt: Date.now(),
      });
      fetchProducts();
      setForm({ name: "", price: "", category: "", description: "", stock_quantity: "" });
      setImageFile(null);
    } catch (err) {
      console.error("Error adding product:", err);
    }
    setUploading(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <div className="p-4 text-white">
      <h2>Admin Dashboard</h2>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key.replace(/_/g, " ")}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="m-2 p-2 text-black"
            required
          />
        ))}
        <div className="m-2">
          <label className="block mb-1">Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
            required
          />
        </div>
        <button type="submit" className="btn btn-light m-2" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <h4 className="mb-4">Products</h4>
      <ul className="mb-6">
        {products.map((prod) => (
          <li key={prod.id} className="flex items-center mb-3">
            {prod.imageUrl && (
              <img
                src={prod.imageUrl}
                alt={prod.name}
                style={{ width: 60, height: 60, objectFit: "cover", marginRight: 12 }}
              />
            )}
            <div className="flex-1">
              <strong>{prod.name}</strong><br />${prod.price.toFixed(2)}
            </div>
            <button
              onClick={() => handleDelete(prod.id)}
              className="btn btn-sm btn-danger ml-4"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Orders List */}
      <h4 className="mb-4">Orders</h4>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.email || order.userId}</td>
              <td>
                {order.orderDate?.seconds
                  ? new Date(order.orderDate.seconds * 1000).toLocaleString()
                  : new Date(order.createdAt).toLocaleString()}
              </td>
              <td>{order.status}</td>
              <td>
                <button
                  onClick={() => handleStatusUpdate(order.id, order.status)}
                  className="btn btn-sm btn-primary"
                >
                  {order.status === "Pending"
                    ? "Mark as Shipped"
                    : order.status === "Shipped"
                    ? "Mark as Completed"
                    : "Reset to Pending"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;