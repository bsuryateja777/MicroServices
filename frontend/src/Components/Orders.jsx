import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/orders/my-orders", { withCredentials: true })
      .then(res => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders", err);
        setLoading(false);
      });
  }, []);

  // 🎨 Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "placed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No orders yet 🛒
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.map(order => (
        <div
          key={order._id}
          className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition"
        >
          {/* 🔝 Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order._id}</p>
            </div>

            <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* 💰 Total */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-600">Total Amount</p>
            <p className="font-semibold text-lg">${order.totalAmount}</p>
          </div>

          {/* 📦 Items */}
          <div className="border-t pt-3 space-y-2">
            {order.orders?.map(child => (
              <div key={child._id} className="text-sm text-gray-700">
                {child.products.map(p => (
                  <div key={p._id} className="flex justify-between">
                    <span>
                      Qty: {p.quantity}
                    </span>
                    <span>
                      ${p.price}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* 📅 Date */}
          <div className="mt-3 text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}