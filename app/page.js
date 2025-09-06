"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { useSession } from "next-auth/react";
import Filter from "@/components/Filter";
import Image from "next/image";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    }
    loadProducts();
  }, []);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted!");
    } else {
      toast.error(data.error || "Failed to delete.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    if (!window.confirm("Delete selected products?")) return;
    const res = await fetch("/api/products/deleteMany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    });
    const data = await res.json();
    if (data.success) {
      setProducts((prev) => prev.filter((p) => !selected.includes(p._id)));
      setSelected([]);
      toast.success("Selected products deleted!");
    } else {
      toast.error(data.error || "Failed to delete selected.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL products?")) return;
    const res = await fetch("/api/products/deleteMany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: products.map((p) => p._id) }),
    });
    const data = await res.json();
    if (data.success) {
      setProducts([]);
      setSelected([]);
      toast.success("All products deleted!");
    } else {
      toast.error(data.error || "Failed to delete all.");
    }
  };

  const { addToCart } = useCart();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
      <div className="">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">

          <Filter
            onSearch={async ({ category, query, sort }) => {
              
                fetch(`/api/products?category=${category}&q=${query}&sort=${sort}`)
                  .then(res => res.json())
                  .then(data => setProducts(data.products || []))
                  .catch(err => console.error(err));
                

                
                
              
            }}
          />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>



          {isAdmin && (
            <div className="flex gap-4 my-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded font-bold"
                onClick={handleDeleteAll}
              >
                Delete All
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded font-bold"
                onClick={handleDeleteSelected}
                disabled={selected.length === 0}
              >
                Delete Selected
              </button>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12">
            {products.map((product) => (
              <div key={product._id} className="group p-4 rounded-lg shadow relative">
                {isAdmin && (
                  <input
                    type="checkbox"
                    className="absolute top-2 left-2 w-5 h-5"
                    checked={selected.includes(product._id)}
                    onChange={() => handleSelect(product._id)}
                  />
                )}
                <Image
                  alt={product.title}
                  src={product.image[0]}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover lg:aspect-auto lg:h-80"
                />

                <div className="p-2">
                  <h3 className="text-sm mt-2 capitalize font-bold">{product.title}</h3>
                  <div className="my-2 flex justify-between">
                    <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                    <p className="text-sm font-medium text-gray-900">In Stock: {product.inStock}</p>
                  </div>
                  <div>
                    <p className="mt-1 text-sm h-16 overflow-hidden text-gray-500">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    {isAdmin ? (
                      <>
                        <Link
                          href={`/CreateProduct?id=${product._id}`}
                          className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 mt-3 hover:opacity-65 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                          Edit
                        </Link>
                        <button
                          className="bg-red-500 mt-3 hover:opacity-65 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/product/${product._id}`}
                          className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 mt-3 hover:opacity-65 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                        >
                          View
                        </Link>
                        <button
                          className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 mt-3 hover:opacity-65 mt-3 cursor-pointer text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
                          onClick={() => {
                            addToCart(product);
                            toast('Added To Cart', {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: false,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              transition: Bounce,
                            });
                          }}
                        >
                          Buy
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}