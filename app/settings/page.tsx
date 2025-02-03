"use client";

import withAuthGuard from "@/hooks/withAuthGuard";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";

const SettingsPage = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn || !user) {
    return (
      <p className="text-red-500 text-center mt-10">
        Unable to fetch user details.
      </p>
    );
  }

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>

      <div className="flex flex-col  space-y-4">
        {/* Profile Picture */}
        {user.imageUrl && (
          <Image
            src={user.imageUrl}
            alt="User profile"
            width={100}
            height={100}
            className="rounded-full border-8 border-gray-300 shadow"
            priority
          />
        )}

        {/* User Info */}
        <div className="w-full text-left space-y-2">
          <p>
            <strong>Name:</strong> {user.fullName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {user.primaryEmailAddress?.emailAddress || "N/A"}
          </p>
          <p>
            <strong>Username:</strong> {user.username || "N/A"}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <strong>Last Sign-In:</strong>{" "}
            {new Date(user.lastSignInAt || "").toLocaleString()}
          </p>
          <p
            className={
              user.primaryEmailAddress?.verification?.status === "verified"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            <strong>Email Verified:</strong>{" "}
            {user.primaryEmailAddress?.verification?.status === "verified"
              ? "Yes ✅"
              : "No ❌"}
          </p>
        </div>

        {/* Logout Button */}
        <SignOutButton>
          <div className="flex justify-center items-center">
            <button className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600">
              Sign Out
            </button>
          </div>
        </SignOutButton>
      </div>
    </div>
  );
};

export default withAuthGuard(SettingsPage);
