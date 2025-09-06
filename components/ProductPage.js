"use client"
import React, { useState } from "react";
import { useCart } from "@/context/cartContext";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Image from "next/image";

const ProductPage = ({ product }) => {
  const { addToCart } = useCart();
  const [tab, settab] = useState(0);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white shadow-md rounded-2xl p-4 md:p-6 md:flex gap-6">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
              <Image
                src={product.image[tab]}
                alt={product.title}
                className="max-h-80 object-cover object-center rounded-lg"
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {product.image.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={product.title}
                  onClick={() => settab(index)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    tab === index ? "border-blue-500" : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl capitalize font-bold">{product.title}</h1>
              <p className="font-bold mt-2">Price: ₹{product.price}</p>

              <div className="flex justify-between items-center mt-2">
                {product.inStock > 0 ? (
                  <p className="text-lg font-semibold">
                    In Stock: {product.inStock}
                  </p>
                ) : (
                  <p className="text-red-500 font-semibold">Out of Stock</p>
                )}
                <div className="text-sm text-gray-600">Sold: {product.sold}</div>
              </div>

              <p className="mt-3 text-gray-700">{product.description}</p>
              <p className="mt-2 text-gray-600">{product.content}</p>
            </div>

            {/* Add to Cart Button */}
            <button
              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 mt-6 w-full md:w-auto hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              onClick={() => {
                addToCart(product);
                toast.success("Added To Cart", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "light",
                  transition: Bounce,
                });
              }}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
