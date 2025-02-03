import { REVIEWS_PER_PAGE } from "@/constants";

export const fetchReviews = async (offset: number) => {
  try {
    const token = "";
    console.log("🚀 ~ fetchReviews ~ token:", token);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback?offset=${offset}&limit=${REVIEWS_PER_PAGE}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("🚀 ~ fetchReviews ~ response:", response);

    if (!response.ok) {
      throw new Error("Failed to fetch reviews.");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("🚀 ~ fetchReviews ~ err:", err);
    throw new Error(
      err instanceof Error ? err.message : "An unexpected error occurred."
    );
  }
};
