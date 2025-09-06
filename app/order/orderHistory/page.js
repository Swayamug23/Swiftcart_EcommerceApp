"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function OrderHistory() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user/orders?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []));
    }
  }, [session]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Order history</h1>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Check the status of recent orders, manage returns, and discover similar
        products.
      </p>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 bg-white"
          >
            {/* Order header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 my-5 border rounded-lg shadow-sm">
              <div>
                <div className="font-medium">Order ID:</div>
                <div className="text-gray-400 text-sm break-all">{order._id}</div>
              </div>

              <div>
                <div className="font-medium">Date placed:</div>
                <div className="text-gray-400 text-sm">
                  {new Date(order.createdAt).toISOString().split("T")[0]}
                </div>
              </div>

              <div>
                <div className="font-medium">Total amount:</div>
                <div className="text-gray-400 text-sm">₹{order.total}</div>
              </div>

              <div>
                <div className="font-medium">Mobile:</div>
                <div className="text-gray-400 text-sm break-words">
                  {order.mobile}
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                <div className="font-medium">Address:</div>
                <div className="text-gray-400 text-sm break-words">
                  {order.address}
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="space-y-6">
              {order.cart.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 last:border-none pb-6 last:pb-0"
                >
                  <div className="bg-gray-100 w-full sm:w-40 h-40 flex items-center justify-center rounded-md overflow-hidden">
                    <Image
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between mb-2 items-start sm:items-center gap-2">
                      <h3 className="capitalize font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="font-semibold text-gray-700">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>

                    <div className="my-2 text-sm space-y-1">
                      <div className="text-gray-500">{item.description}</div>
                      <div className="text-gray-500">Mode: RazorPay</div>
                      <div className="text-gray-500">
                        PaymentID: {order.PaymentID}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <Link
                        href={`/product/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View product
                      </Link>
                      <Link
                        href={`/`}
                        className="text-blue-600 hover:underline"
                      >
                        Buy again
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
