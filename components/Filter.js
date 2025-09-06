"use client";
import React, { useState, useEffect } from "react";

const Filter = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    // Fetch categories from API
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ category, query, sort });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center bg-white p-4 rounded-2xl shadow-md w-full"
    >
      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 rounded-xl border border-gray-300 focus:ring focus:ring-blue-300 flex-1"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Text Search */}
      <div className="flex items-center flex-1 border border-gray-300 rounded-xl px-3">
        <span className="mr-2 text-gray-500">🔍</span>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 outline-none"
        />
      </div>

      {/* Sort Selector */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="p-2 rounded-xl border border-gray-300 focus:ring focus:ring-blue-300 flex-1"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="bestselling">Best Selling</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
      </select>

      {/* Search Button */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
      >
        Search
      </button>
    </form>
  );
};

export default Filter;
