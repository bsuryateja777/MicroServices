import { useEffect, useState } from "react";
import axios from "axios";
import { notifyError, notifySuccess } from "../Utils/toastify";
export default function CartPage() {

  const [cartItems, setCartItems] = useState([]);
  const hasInvalidItems = cartItems.some((item) => item.isOutOfStock);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart");
      setCartItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateQuantity = async (id, type) => {
    try {
      const res = await axios.put(`/api/cart/${id}`, { type });

      setCartItems(res.data);
    } catch (err) {
      notifyError(err.response?.data?.error || "Something went wrong");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Remove this item?")) return;

    try {
      const res = await axios.delete(`/api/cart/${id}`);
      setCartItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => {
      if (item.isOutOfStock) return acc;
      return acc + item.price * item.quantity;
    }, 0);
  };

  // 🧾 EMPTY CART UI
  if (!cartItems.length) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-3">Your Cart is Empty 🛒</h1>
        <p className="text-gray-500">Add some products to get started</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const validItems = cartItems.filter((item) => !item.isOutOfStock);

      if (validItems.length === 0) {
        notifyError("No valid items to checkout");
        return;
      }

      await axios.post(
        "/api/orders/place-order",
        {
          cartItems: validItems, // ✅ FULL ARRAY
        },
        {
          withCredentials: true,
        },
      );

      await axios.delete("/api/cart/clear");

      notifySuccess("Order placed successfully 🎉");
      setCartItems([]);
    } catch (err) {
      notifyError("Checkout failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {/* Header */}
      <div className="grid grid-cols-7 font-semibold border-b pb-3 text-gray-600">
        <div>Product</div>
        <div className="col-span-2">Details</div>
        <div className="text-center">Quantity</div>
        <div>Price</div>
        <div>Total</div>
        <div className="text-center">Options</div>
      </div>

      {/* Items */}
      {cartItems.map((item) => (
        <div
          key={item._id}
          className="grid grid-cols-7 items-center gap-4 py-4 border-b relative hover:bg-gray-50"
        >
          {/* 🔴 OUT OF STOCK OVERLAY (spans till Total column) */}
          {item.isOutOfStock && (
            <div className="absolute left-0 top-0 h-full col-span-6 w-[calc(100%-80px)] flex items-center justify-center bg-white/70 z-10">
              <span className="text-red-600 font-bold text-lg">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Image */}
          <img
            src={item.image || "https://via.placeholder.com/80"}
            alt={item.title}
            className="w-20 h-20 object-cover rounded-lg"
          />

          {/* Title */}
          <div className="col-span-2">
            <h2 className="font-semibold">{item.title}</h2>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={item.isOutOfStock}
              onClick={() => updateQuantity(item._id, "decrease")}
              className="px-2 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
            >
              -
            </button>

            <span className="font-medium">{item.quantity}</span>

            <button
              disabled={item.isOutOfStock || item.quantity >= item.stock}
              onClick={() => {
                if (item.quantity >= item.stock) {
                  notifyError(`Only ${item.stock} items available`);
                  return;
                }
                updateQuantity(item._id, "increase");
              }}
              className="px-2 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div>${item.price}</div>

          {/* Total */}
          <div className="font-semibold">${item.price * item.quantity}</div>

          {/* 🗑️ REMOVE BUTTON (always visible) */}
          <div className="flex justify-center z-20">
            <button
              onClick={() => removeItem(item._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-end mt-8">
        <div className="w-80 border p-5 rounded-xl shadow-md bg-white">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${getTotal()}</span>
          </div>

          <div className="flex justify-between mb-4 text-gray-500 text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={hasInvalidItems}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
