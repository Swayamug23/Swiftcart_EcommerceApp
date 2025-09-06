"use client";

import React, { useState } from "react";
import Link from "next/link";
import valid from "@/utils/valid";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { fetchuser, updateProfile } from "@/actions/useraction";
import { signIn } from "next-auth/react";

const Page = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationMsg = valid("", email, password);

    if (validationMsg !== true) {
      toast.error(validationMsg, {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      toast.success("Signed In", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
      window.location.href = "/";
    } else {
      toast.error(res.error || "Sign in failed", {
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
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
        <h4 className="block text-xl font-medium text-slate-800">Sign In</h4>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="w-full rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition sm:border-none sm:shadow-none sm:p-0">
              <label htmlFor="email" className="block text-sm text-gray-600">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChangeInput}
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Your Email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="w-full rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition sm:border-none sm:shadow-none sm:p-0">
              <label htmlFor="password" className="block text-sm text-gray-600">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChangeInput}
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Your Password"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <div className="w-full rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition sm:border-none sm:shadow-none sm:p-0">
              <button
                type="submit"
                className="w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 active:bg-slate-700 disabled:pointer-events-none disabled:opacity-50"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-3 text-center text-sm text-gray-400">
            You don&apos;t have an account?{" "}
            <Link href="/Register" className="font-semibold text-red-400">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Page;
