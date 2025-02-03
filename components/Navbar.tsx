"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { HiSearch, HiMenu } from "react-icons/hi";

export default function Navbar({
  toggleSidebar,
  collapsed,
}: {
  toggleSidebar: () => void;
  collapsed: boolean;
}) {
  const { user } = useUser();
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 h-fit">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className={`focus:outline-none ${collapsed ? "" : "hidden"}`}
        >
          <HiMenu className="h-6 w-6 text-gray-700" />
        </button>
        <div className="text-lg font-medium text-gray-800">
          {getGreeting()}, {user?.fullName || "Guest"}
        </div>
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
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
