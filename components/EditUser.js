"use client";
import React from "react";
import { handleAdmin } from "@/actions/useraction";
import { ToastContainer, toast, Bounce } from "react-toastify";

const EditUser = ({ user }) => {
  const isAdmin = user.role === "admin";

  const handleToggleAdmin = async () => {
    const res = await handleAdmin(user._id, !isAdmin);
    if (res.error) {
      console.log(res.error);
      toast.error("Failed to update user role", {
        position: "top-right",
        autoClose: 4000,
      });
    } else {
      toast.success("User role updated successfully", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className="mx-auto flex flex-col gap-6 px-4 mt-8 w-full max-w-lg bg-white rounded-xl shadow p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center">
          Edit User
        </h1>

        {/* Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label
            htmlFor="name"
            className="w-24 font-medium text-gray-700"
          >
            Name
          </label>
          <input
            defaultValue={user.name}
            disabled
            className="flex-1 p-2 shadow rounded bg-gray-100 text-gray-700"
            id="name"
            name="name"
            type="text"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label
            htmlFor="email"
            className="w-24 font-medium text-gray-700"
          >
            Email
          </label>
          <input
            defaultValue={user.email}
            disabled
            className="flex-1 p-2 shadow rounded bg-gray-100 text-gray-700"
            id="email"
            name="email"
            type="text"
          />
        </div>

        {/* Toggle Role Button */}
        <button
          className="mt-2 cursor-pointer bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 text-white font-medium py-2 px-4 rounded-lg shadow hover:opacity-90 transition"
          onClick={handleToggleAdmin}
        >
          {isAdmin ? "Remove Admin" : "Make User Admin"}
        </button>
      </div>
    </>
  );
};

export default EditUser;
