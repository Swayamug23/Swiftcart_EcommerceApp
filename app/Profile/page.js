"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import valid from "@/utils/valid";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Link from "next/link";
import AdminPanel from "@/components/AdminPanel";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const [avatar, setAvatar] = useState(session?.user?.avatar || "");
  

  useEffect(() => {
    if (activeTab === "orders" && session?.user?.email) {
      fetch(`/api/user/orders?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []));
    }
  }, [activeTab, session]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", session.user.email);
    const res = await fetch("/api/user/updateAvatar", {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();

    if (data.success) {
      setAvatar(URL.createObjectURL(file));
      toast.success("Avatar updated successfully");
    } else {
      toast.error(data.error || "Failed to update avatar");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") setPassword(value);
    if (name === "name") setName(value);
  };

  const updateName = async () => {
    if (!name) {
      alert("Please enter a new name.");
      return;
    }
    const res = await fetch("/api/user/updateName", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, name }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Name Changed Successfully", { transition: Bounce });
      setName("");
    } else {
      alert(data.error || "Failed to update name.");
    }
  };

  const updatePassword = async () => {
    if (!password) {
      alert("Please enter a new password.");
      return;
    }
    const validationMsg = valid("", session.user.email, password);
    if (validationMsg !== true) {
      toast.error(validationMsg, { transition: Bounce });
      return;
    }
    const res = await fetch("/api/user/resetPassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, password }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Password Changed Successfully", { transition: Bounce });
      setPassword("");
    } else {
      alert(data.error || "Failed to update password.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">User profile</h1>
            <p className="text-gray-500">
              Manage your details, view your tier status and change your
              password.
            </p>

            {/* Avatar + General Info */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="relative group h-[200px] w-[300px] bg-white rounded shadow flex flex-col items-center">
                <Image
                  src={session?.user?.avatar}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full mt-4"
                />
                <input
                  type="file"
                  className="hidden"
                  id="avatar"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="avatar"
                  className="absolute bottom-[40px] w-32 h-32 rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-80 cursor-pointer bg-black/60 text-white transition-opacity duration-200"
                >
                  Update avatar
                </label>
                <div>
                  <h2 className="text-lg font-bold capitalize text-indigo-400 mt-2">
                    {session?.user?.name}
                  </h2>
                </div>
              </div>

              <div className="bg-white h-[200px] p-5 w-full rounded shadow">
                <h3 className="text-lg font-semibold mb-4">
                  General information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Change your name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="shadow capitalize text-indigo-400 p-2 rounded w-full"
                  />
                </div>
                <button
                  className="mt-4 px-4 py-2 border border-slate-400 text-indigo-400 rounded-lg"
                  onClick={updateName}
                >
                  Update
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <div className="grid relative grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="email"
                  disabled={true}
                  defaultValue={session?.user?.email}
                  className="shadow text-indigo-400 p-2 rounded"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create New Password"
                    className="shadow text-indigo-400 p-2 rounded w-full"
                    onChange={handleChange}
                    name="password"
                    value={password}
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 border border-slate-400 text-indigo-400 rounded-lg"
                  onClick={updatePassword}
                >
                  Change password
                </button>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <>
            <h1 className="text-xl font-bold">Your Orders</h1>
            <p className="text-gray-500">
              Manage your orders and view your order history.
            </p>

            <div className="mt-4 bg-white rounded shadow p-4 overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-300 shadow h-12">
                    <th className="px-2 py-1">Order ID</th>
                    <th className="px-2 py-1">Order Date</th>
                    <th className="px-2 py-1">Amount</th>
                    <th className="px-2 py-1">Delivered</th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-400"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="h-10 text-gray-500">
                        <td className="px-2 text-center py-1">{order._id}</td>
                        <td className="px-2 text-center py-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-2 text-center py-1">₹{order.total}</td>
                        <td className="px-2 text-center py-1">
                          {order.delivered ? "Yes" : "No"}
                        </td>
                        <td className="px-2 text-center py-1 cursor-pointer">
                          <Link
                            href={`/order/${order._id}`}
                            className="text-indigo-500"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        );
      case "admin":
        return <AdminPanel />;
      default:
        return <h1>Select an option from the sidebar</h1>;
    }
  };

  return (
    <>
      <ToastContainer transition={Bounce} />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-[300px] mt-4 md:mt-8">
          <nav className="space-y-4 bg-gray-50 rounded px-2 py-6 shadow">
            {[
              { key: "profile", label: "User Profile" },
              { key: "orders", label: "Orders" },
              ...(session?.user?.role === "admin"
                ? [{ key: "admin", label: "Admin Panel" }]
                : []),
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`block w-full text-left px-4 py-2 rounded ${
                  activeTab === item.key
                    ? "text-indigo-400 font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="bg-gray-400 h-[1px] w-full"></div>
            <div className="px-2">
              <Link
                href={"/order/orderHistory"}
                className="flex items-center gap-2 cursor-pointer mt-6 hover:text-indigo-500"
              >
                View Order History
              </Link>
              <button className="flex items-center gap-2 text-red-500 mt-6 hover:underline">
                Sign out
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-10">{renderContent()}</main>
      </div>
    </>
  );
}
