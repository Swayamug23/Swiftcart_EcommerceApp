"use client";
import React, { useState } from "react";
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const { data: session } = useSession();

  const handleQuantity = (id, type) => {
    const item = cart.find((item) => item._id === id);
    if (!item) return;
    if (type === "inc") {
      updateQuantity(id, item.quantity + 1);
    } else if (type === "dec" && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    } else if (type === "dec" && item.quantity === 1) {
      if (window.confirm("Are you sure you want to remove this item from the cart?")) {
        removeFromCart(id);
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this item from the cart?")) {
      removeFromCart(id);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    // ... your Razorpay logic unchanged
    toast.success("Payment successful!");
    clearCart();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col  lg:flex-row gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col items-center  sm:flex-row sm:items-center gap-4 p-4 bg-white rounded shadow"
                >
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image[0]}
                      alt={item.title}
                      className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-col justify-center md:w-full">
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-gray-600">₹{item.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded"
                        onClick={() => handleQuantity(item._id, "dec")}
                      >
                        −
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        className="px-3 py-1 bg-gray-200 rounded"
                        onClick={() => handleQuantity(item._id, "inc")}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delete button */}
                  <div className="flex sm:block justify-end">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 text-xl font-bold text-right sm:text-left">
            Total: ₹{total}
          </div>
        </div>

        {/* Payment Form */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <textarea
                className="w-full border rounded p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Mobile Number</label>
              <input
                type="tel"
                className="w-full border rounded p-2"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
              disabled={cart.length === 0 || !address || mobile.length < 10}
            >
              Pay with Razorpay ₹{total}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
