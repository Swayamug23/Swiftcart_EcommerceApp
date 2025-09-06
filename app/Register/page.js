"use client";

import React, { useState } from "react";
import Link from "next/link";
import valid from "@/utils/valid";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { fetchuser, updateProfile } from "@/actions/useraction";

const SignUpPage = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { name, email, password } = userData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMsg = valid(name, email, password);

    if (validationMsg === true) {
      toast.success("Successfully submitted", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      console.log("Form is valid, proceed with submission");
    } else {
      toast.error(`${validationMsg}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      console.log(validationMsg);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Successfully registered!", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.error(data.message || "Registration failed", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="relative flex flex-col rounded-xl items-center bg-transparent p-6">
        <h4 className="block text-xl font-medium text-slate-800">Sign Up</h4>
        <p className="text-slate-500 font-light">
          Nice to meet you! Enter your details to register.
        </p>

        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            {/* Name */}
            <div className="w-full rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition sm:border-none sm:shadow-none sm:p-0">
              <label className="block mb-2 text-sm text-slate-600">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChangeInput}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Your Name"
              />
            </div>

            {/* Email */}
            <div className="w-full rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition sm:border-none sm:shadow-none sm:p-0">
              <label className="block mb-2 text-sm text-slate-600">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChangeInput}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Your Email"
              />
            </div>

            {/* Password */}
            <div className="w-full rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition sm:border-none sm:shadow-none sm:p-0">
              <label className="block mb-2 text-sm text-slate-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChangeInput}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Your Password"
              />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="inline-flex items-center mt-2">
            <label
              className="flex items-center cursor-pointer relative"
              htmlFor="check-2"
            >
              <input
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                id="check-2"
              />
              <span className="absolute text-white opacity-0 pointer-events-none peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </label>
            <label
              className="cursor-pointer ml-2 text-slate-600 text-sm"
              htmlFor="check-2"
            >
              Remember Me
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="Submit"
            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Sign Up
          </button>

          {/* Footer Text */}
          <p className="flex justify-center mt-6 text-sm text-slate-600">
            Already have an account?
            <Link
              href="/Signin"
              className="ml-1 text-sm font-semibold text-slate-700 underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
