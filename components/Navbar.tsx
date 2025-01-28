"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

export default function Navbar() {
  const { user } = useUser();

  const handleLogout = async () => {
    window.location.href = "/api/auth/logout?returnTo=/";
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 border  h-fit">
      {/* Left Section */}
      <div className="text-lg font-medium text-gray-800">
        {getGreeting()}, {user?.name || "Guest"}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
          <HiSearch className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 ml-2 text-sm focus:outline-none"
          />
        </div>
        {user ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link href="/api/auth/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
