import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";

const SettingsPage = async () => {
  const session = await getSession();
  const user = session?.user;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>

      {user ? (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">User Details</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Nickname:</strong> {user.nickname}
          </p>
          <p>
            <strong>Picture:</strong>
            <Image
              src={user.picture}
              alt="User profile"
              width={64}
              height={64}
              className="rounded-full mt-2"
            />
          </p>
          <p>
            <strong>Sub:</strong> {user.sub}
          </p>
        </div>
      ) : (
        <p className="text-red-500">Unable to fetch user details.</p>
      )}
    </div>
  );
};

export default SettingsPage;
