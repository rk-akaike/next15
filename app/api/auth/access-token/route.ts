import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies properly

export async function GET() {
  try {
    // ✅ Get the cookies correctly without awaiting it
    const cookieStore = cookies();

    // Fetch the access token
    const accessToken = await getAccessToken();

    if (!accessToken?.accessToken) {
      return NextResponse.json(
        { error: "Access token not available" },
        { status: 401 }
      );
    }

    return NextResponse.json({ accessToken: accessToken.accessToken });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching access token:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch access token", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error", error);
      return NextResponse.json(
        { error: "Unexpected error occurred", details: String(error) },
        { status: 500 }
      );
    }
  }
}
