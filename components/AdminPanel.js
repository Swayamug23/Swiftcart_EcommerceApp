import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

const AdminPanel = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setAllOrders(data.orders || []));
  }, []);

  const markDelivered = async (orderId) => {
    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Order marked as delivered!");
      setAllOrders((orders) =>
        orders.map((o) =>
          o._id === orderId ? { ...o, delivered: true } : o
        )
      );
    } else {
      toast.error("Failed to update order.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">
        All Orders (Admin)
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="mt-4 bg-white rounded shadow p-4 w-full">
          <thead>
            <tr className="bg-gray-300 shadow py-2 h-12">
              <th className="px-2 py-1">Order ID</th>
              <th className="px-2 py-1">User</th>
              <th className="px-2 py-1">Amount</th>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Delivered</th>
              <th className="px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-gray-400"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-2 py-1">
                    <Link href={`/order/${order._id}`}>
                      {order._id}
                    </Link>
                  </td>
                  <td className="px-2 py-1">
                    {order.user?.name || "Guest"}
                  </td>
                  <td className="px-2 py-1">₹{order.total}</td>
                  <td className="px-2 py-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-1">
                    {order.delivered ? "Yes" : "No"}
                  </td>
                  <td className="px-2 py-1">
                    {!order.delivered && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => markDelivered(order._id)}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {allOrders.length === 0 ? (
          <div className="text-center py-6 text-gray-400 bg-white rounded-xl shadow">
            No orders found.
          </div>
        ) : (
          allOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4 space-y-2"
            >
              <div className="text-sm">
                <span className="font-medium">Order ID:</span>{" "}
                <Link
                  href={`/order/${order._id}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {order._id}
                </Link>
              </div>
              <div className="text-sm">
                <span className="font-medium">User:</span>{" "}
                {order.user?.name || "Guest"}
              </div>
              <div className="text-sm">
                <span className="font-medium">Amount:</span> ₹{order.total}
              </div>
              <div className="text-sm">
                <span className="font-medium">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm">
                <span className="font-medium">Delivered:</span>{" "}
                {order.delivered ? "Yes" : "No"}
              </div>
              {!order.delivered && (
                <button
                  className="w-full mt-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => markDelivered(order._id)}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
