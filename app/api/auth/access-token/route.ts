import { getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not available" },
        { status: 401 }
      );
    }

    return NextResponse.json({ accessToken: accessToken.accessToken });
  } catch (error: any) {
    console.error("Error fetching access token:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch access token", details: error.message },
      { status: 500 }
    );
  }
}
