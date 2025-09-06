"use client";
import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

const Page = () => {
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetch("/api/category")
            .then(res => res.json())
            .then(data => setCategories(data.categories || []));
    }, []);

    const handleChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (category.trim() === "") return;

        if (editId) {
            // Update
            const res = await fetch("/api/category", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editId, name: category }),
            });
            const data = await res.json();
            if (data.success) {
                setCategories(prev =>
                    prev.map(cat => cat._id === editId ? data.category : cat)
                );
                setEditId(null);
                setCategory("");
            } else {
                alert(data.error || "Failed to update category");
            }
        } else {
            // Create
            const res = await fetch("/api/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: category }),
            });
            const data = await res.json();
            if (data.success) {
                setCategories(prev => [data.category, ...prev]);
                setCategory("");
            } else {
                alert(data.error || "Failed to add category");
            }
        }
    };

    const handleEdit = (cat) => {
        setEditId(cat._id);
        setCategory(cat.name);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        const res = await fetch("/api/category", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
            setCategories(prev => prev.filter(cat => cat._id !== id));
        } else {
            alert(data.error || "Failed to delete category");
        }
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setCategory("");
    };

    return (
        <div className='flex flex-col my-8 items-center px-4 h-auto'>
            <h1 className='text-2xl font-bold text-center'>Create Categories</h1>
            <form
                className='flex flex-col sm:flex-row items-center w-full sm:w-3/4 md:w-1/2 gap-4 mt-4'
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    name='category'
                    value={category}
                    placeholder="Add a Category"
                    className='p-2 w-full border border-gray-300 shadow rounded-md'
                    onChange={handleChange}
                />
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        type="submit"
                        className='p-2 bg-blue-500 text-white rounded-md w-full sm:w-auto'
                    >
                        {editId ? "Update" : "Create"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            className='p-2 bg-gray-400 text-white rounded-md w-full sm:w-auto'
                            onClick={handleCancelEdit}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className='flex flex-col mt-8 w-full sm:w-3/4 md:w-1/2'>
                <h2 className='text-xl font-bold mb-2'>Categories</h2>
                <div>
                    {categories.map((cat) => (
                        <div
                            className='flex flex-col sm:flex-row w-full justify-between p-3 px-4 border my-3 border-gray-300 shadow items-start sm:items-center gap-2'
                            key={cat._id}
                        >
                            <span className="w-full sm:w-auto">{cat.name}</span>
                            <div className='flex gap-4 text-lg font-bold w-full sm:w-auto justify-end'>
                                <button type="button" onClick={() => handleEdit(cat)}>
                                    <FaRegEdit />
                                </button>
                                <button type="button" onClick={() => handleDelete(cat._id)}>
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
