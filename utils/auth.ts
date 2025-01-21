import jwt from "jsonwebtoken";

export const fetchAccessToken = async () => {
  try {
    const response = await fetch("/api/auth/access-token");
    const data = await response.json();
    console.log("🚀 ~ fetchAccessToken ~ data:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch access token");
    }

    return data.accessToken;
  } catch (err) {
    console.error("Error fetching access token:", err);
    throw err;
  }
};

export const decodeAccessToken = (token: string, publicKey: string) => {
  return jwt.decode(token, { complete: true });
};
