"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Image from "next/image";

const initialState = {
  title: "",
  description: "",
  price: "",
  content: "",
  category: "",
  inStock: "",
};

export default function ProductCreateForm() {
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true); // initially true
  const fileInputRef = useRef();

  // Use searchParams safely after component mounts
  const [editId, setEditId] = useState(null);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams) {
      setEditId(searchParams.get("id"));
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategoriesList(data.categories || []))
      .catch(() => setCategoriesList([]));
  }, []);

  // Fetch product if editing
  useEffect(() => {
    if (!editId) {
      setLoading(false); // no edit, ready to render
      return;
    }
    setLoading(true);
    fetch(`/api/products/${editId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setForm({
            title: data.product.title,
            description: data.product.description,
            price: data.product.price,
            content: data.product.content,
            category: data.product.category,
            inStock: data.product.inStock,
          });
          setImages(data.product.image || []);
          setImageFiles([]);
        }
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false));
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setError("You can only upload up to 5 images.");
      return;
    }
    setError("");
    setImages((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prev) => [...prev, ...files]);
    fileInputRef.current.value = "";
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    setError("");
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    imageFiles.forEach((file) => formData.append("images", file));
    images.forEach((img) => {
      if (typeof img === "string" && img.startsWith("/uploads/")) {
        formData.append("existingImages", img);
      }
    });

    let res, data;
    try {
      if (editId) {
        res = await fetch(`/api/products/${editId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          body: formData,
        });
      }

      const text = await res.text();
      if (!text) throw new Error("No response from server");
      data = JSON.parse(text);

      if (data.success) {
        toast.success(editId ? "Product updated!" : "Product created!");
        setForm(initialState);
        setImages([]);
        setImageFiles([]);
      } else {
        setError(data.error || "Failed to save product.");
      }
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-indigo-700">
          {editId ? "Edit Product" : "Create Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              className="w-full border border-gray-400 rounded p-2"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              className="w-full border border-gray-400 rounded p-2"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price & Stock */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Price</label>
              <input
                className="w-full border border-gray-400 rounded p-2"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">In Stock</label>
              <input
                className="w-full border border-gray-400 rounded p-2"
                type="number"
                name="inStock"
                value={form.inStock}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              className="w-full border text-sm text-gray-500 border-gray-400 rounded p-2"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categoriesList.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea
              className="w-full h-28 border border-gray-400 rounded p-2"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          {/* Images */}
          <div>
            <label
              htmlFor="upload-images"
              className="block cursor-pointer font-medium mb-1"
            >
              Upload Images (max 5)
            </label>
            <input
              id="upload-images"
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
              disabled={images.length >= 5}
            />

            <div className="my-3 flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <Image
                    src={img}
                    alt={`Product ${idx + 1}`}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    className="rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-600">{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition"
          >
            {editId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>
    </>
  );
}
