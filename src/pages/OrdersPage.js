import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <Container className="mt-5 text-white">
      <h2>Your Orders</h2>
      {loading && (
        <div className="my-4">
          <Spinner animation="border" variant="light" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && orders.length === 0 && (
        <Alert variant="info">You have no orders yet.</Alert>
      )}
      {!loading && orders.length > 0 && (
        <Table striped bordered hover variant="dark" responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.id}</td>
                <td>
                  {order.orderDate?.seconds
                    ? new Date(order.orderDate.seconds * 1000).toLocaleString()
                    : "N/A"}
                </td>
                <td>{order.status || "Pending"}</td>
                <td>${order.totalAmount?.toFixed(2) || "0.00"}</td>
                <td>
                  {order.items?.map((item, i) => (
                    <div key={i}>
                      {item.name} (x{item.quantity})
                    </div>
                  )) || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrdersPage;