"use client";

import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";

function ProfileClient() {
  const obj = useUser();
  console.log("🚀 ~ ProfileClient ~ obj:", obj);
  const { user, error, isLoading } = obj;

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        <Image
          src={user.picture ?? ""}
          alt={user.name ?? "User Picture"}
          width={200}
          height={200}
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        {user.name ? (
          // <Link href="/api/auth/logout">Logout</Link>
          <button onClick={handleLogout}>logout</button>
        ) : (
          <Link href="/api/auth/login">Login</Link>
        )}
      </div>
    )
  );
}

export default withPageAuthRequired(ProfileClient);
