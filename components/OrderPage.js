"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetails({ order }) {
  const { data: session } = useSession();
  const [delivered, setDelivered] = useState(order.delivered);
  const [deliveredAt, setDeliveredAt] = useState(order.deliveredAt);

  const markDelivered = async () => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order._id }),
    });
    const data = await res.json();
    if (data.success) {
      setDelivered(true);
      setDeliveredAt(data.order.deliveredAt);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Order Details</h1>
      <p className="text-gray-600 mb-6">
        Track your order status, view items, and manage returns.
      </p>

      <div className="rounded-2xl shadow-md border border-gray-200 p-6 bg-white space-y-6">
        {/* Order Header */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-xl shadow-sm bg-gray-50">
          <div>
            <div className="font-medium">Order ID</div>
            <div className="text-gray-500 text-sm break-words">{order._id}</div>
          </div>
          <div>
            <div className="font-medium">Date Placed</div>
            <div className="text-gray-500 text-sm">
              {new Date(order.createdAt).toISOString().split("T")[0]}
            </div>
          </div>
          <div>
            <div className="font-medium">Total Amount</div>
            <div className="text-gray-500 text-sm">₹{order.total}</div>
          </div>
          <div>
            <div className="font-medium">Mobile</div>
            <div className="text-gray-500 text-sm">{order.mobile}</div>
          </div>
          <div>
            <div className="font-medium">Address</div>
            <div className="text-gray-500 text-sm">{order.address}</div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-6">
          {order.cart.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 pb-6 last:border-none"
            >
              {/* Product Image */}
              <div className="bg-gray-100 w-full sm:w-40 h-40 flex items-center justify-center rounded-xl overflow-hidden">
                <Image
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between mb-2">
                  <h3 className="capitalize font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="font-semibold text-gray-700">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <div className="my-2 text-sm text-gray-500 space-y-1">
                  <p>{item.description}</p>
                  <p>Mode: RazorPay</p>
                  <p>Payment ID: {order.PaymentID}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="font-bold text-sm">
                    Delivered:{" "}
                    <span className="text-gray-500 font-medium">
                      {delivered ? "Yes" : "No"}
                    </span>
                  </div>
                  <Link
                    href={`/product/${item._id}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View product
                  </Link>
                  <Link
                    href="/"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Buy again
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Delivery Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
            {session?.user?.role === "admin" && !delivered && (
              <button
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-4 py-2 text-white rounded shadow hover:opacity-90 transition"
                onClick={markDelivered}
              >
                Mark as Delivered
              </button>
            )}
            {delivered && (
              <div className="text-green-700 font-semibold">
                Delivered on:{" "}
                {deliveredAt
                  ? new Date(deliveredAt).toLocaleString()
                  : "Not Delivered yet"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
