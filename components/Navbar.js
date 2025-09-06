"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/cartContext";
import { FaShoppingCart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { cart } = useCart();



  const isActive = (r) => (r === pathname ? "active" : "");

  const avatarUrl =
    session?.user?.avatar ||
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(session?.user?.name || "User");

  return (
    <nav className="block w-full px-4 py-3 mx-auto my-2 text-white bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500
 shadow rounded-md lg:px-8">
      <div className="container flex flex-wrap items-center justify-between mx-auto">

        <Link
          href="/"
          className="mr-4 cursor-pointer no-underline py-1.5 text-base  font-semibold"
        >
          SwiftKart
        </Link>

        {/* Desktop Menu */}
        <div className={`hidden lg:block ${isOpen ? "block" : ""}`}>
          <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            <li className="flex items-center p-1 text-sm gap-x-2">
              <Link
                href="/Cart"
                className={`flex gap-4 items-center relative  font-bold no-underline  `}
              >
                <FaCartShopping />
                <span className="absolute left-4 bottom-0.5 text-red-600">{cart.length}</span>
                Cart
              </Link>
            </li>
            {!session?.user ? (
              <li className="flex items-center p-1 text-sm gap-x-2 ">
                <Link
                  href="/Signin"
                  className={`flex items-center no-underline hover:text-black ${isActive("/Signin") ? "text-black font-bold" : "text-gray-500"
                    }`}
                >
                  Sign in
                </Link>
              </li>
            ) : (
              <li className="relative flex items-center p-1 text-sm gap-x-2 ">

                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-gray-400"
                  />
                  <span className="ml-2  font-semibold">
                    {session.user.name?.split(" ")[0] || "Profile"}
                  </span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute left-[-25px] top-[40px] mt-2 w-40 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500
 rounded-md shadow-lg z-50">
                    <Link
                      href="/Profile"
                      className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400
"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      Sign out
                    </button>

                    {session?.user?.role === "admin" && (
                      <>
                        <Link href="/Users" className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Users
                        </Link>
                        <Link href="/Categories" className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Categories
                        </Link>
                        <Link href="/CreateProduct" className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Create Products
                        </Link>

                      </>

                    )}
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </span>
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="w-full lg:hidden mt-2">
            <ul className="flex flex-col gap-2">
              <li className="p-1 text-sm text-gray-200">
                <Link href="/Cart" className="no-underline hover:text-white">
                  Cart
                </Link>
              </li>
              {!session?.user ? (
                <li className="p-1 text-sm text-gray-200">
                  <Link href="/Signin" className="no-underline hover:text-white">
                    Sign in
                  </Link>
                </li>
              ) : (
                <li className="relative p-1 text-sm text-gray-200">
                  <button
                    className="flex items-center w-full focus:outline-none"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border border-gray-400"
                    />
                    <span className="ml-2 text-black font-semibold">
                      {session.user.name?.split(" ")[0] || "Profile"}
                    </span>
                    <svg
                      className="w-4 h-4 ml-1 text-black"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50">
                      <Link
                        href="/Profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                      >
                        Sign out
                      </button>
                      {session?.user?.role === "admin" && (
                      <>
                        <Link href="/Users" className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Users
                        </Link>
                        <Link href="/Categories" className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Categories
                        </Link>
                        <Link href="/CreateProduct" className="block px-4 py-2  hover:bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Create Products
                        </Link>

                      </>

                    )}
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;