"use client"
import React, { useState, useEffect } from 'react'
import { fetchUsers, deleteUser } from '@/actions/useraction';
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await fetchUsers();
      if (res) {
        setUsers(res.users);
      }
    };
    getUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      const res = await deleteUser(id);
      if (res.error) {
        toast.error(res.error, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      } else {
        toast.success('Deleted Successfully', {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        setUsers(prev => prev.filter(u => u._id !== id));
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} theme="light" transition={Bounce} />
      <div className="px-2 sm:px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">All Users</h1>

        <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-b w-2 border-blue-gray-100 bg-blue-gray-50"></th>
                <th className="p-2 sm:p-4 border-b border-blue-gray-100 bg-blue-gray-50">Name</th>
                <th className="p-2 sm:p-4 border-b border-blue-gray-100 bg-blue-gray-50">Email</th>
                <th className="p-2 sm:p-4 border-b border-blue-gray-100 bg-blue-gray-50">Role</th>
                <th className="p-2 sm:p-4 border-b border-blue-gray-100 bg-blue-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user._id} className="text-black">
                  <td className="p-2 sm:p-4 border-b border-blue-gray-50">{i + 1}</td>
                  <td className="p-2 sm:p-4 border-b border-blue-gray-50">
                    <div className="flex items-center gap-2 sm:gap-4 capitalize">
                      <Image className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" src={user.avatar} alt={user.name} />
                      <span className="truncate max-w-[120px] sm:max-w-none ">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 border-b border-blue-gray-50 break-words max-w-[150px] sm:max-w-none">
                    {user.email}
                  </td>
                  <td className="p-2 sm:p-4 border-b border-blue-gray-50 capitalize font-bold">{user.role}</td>
                  <td className="p-2 sm:p-4 border-b border-blue-gray-50">
                    <div className="flex gap-3">
                      <Link href={`/editUser/${user._id}`} className="text-lg">
                        <FaRegEdit />
                      </Link>
                      <button
                        className="text-lg cursor-pointer text-red-500"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Page;
