import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, "orders", orderId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) setOrder(snapshot.data());
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div className="p-4 text-white">
      <h2>Order Details</h2>
      {order ? (
        <pre>{JSON.stringify(order, null, 2)}</pre>
      ) : (
        <p>Loading order...</p>
      )}
    </div>
  );
};

export default OrderDetails;
