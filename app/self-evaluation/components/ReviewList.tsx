"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Review } from "@/types/review";
import { useAuth } from "@clerk/nextjs";
import { RATING_COLORS } from "@/constants";

const REVIEWS_PER_PAGE = 4;

// API Fetch function
const fetchReviews = async (
  offset: number,
  token: string
): Promise<{ results: Review[]; count: number }> => {
  try {
    if (!token) throw new Error("Authorization token is missing.");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback?offset=${offset}&limit=${REVIEWS_PER_PAGE}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews.");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export default function ReviewList({
  reviews,
  setReviews,
}: {
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalReviews, setTotalReviews] = useState<number | null>(null);
  const { getToken } = useAuth();

  // Fetch more reviews
  const loadMoreReviews = useCallback(async () => {
    if (loading || !hasMore) return; // Prevent duplicate calls

    setLoading(true);
    setError(null);

    const token = await getToken({ template: "custom-token" });

    try {
      const { results: newReviews, count } = await fetchReviews(
        offset,
        token ?? ""
      );

      // Set total reviews count only once
      if (totalReviews === null && count !== undefined) {
        setTotalReviews(count);
      }

      // Check if there are more reviews to load
      if (reviews.length + newReviews.length >= count) {
        setHasMore(false);
      }

      setReviews((prev) => [...prev, ...newReviews]);
      setOffset((prevOffset) => prevOffset + REVIEWS_PER_PAGE); // Increment offset by 4
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore, reviews, setReviews, totalReviews]);

  // Initial fetch
  useEffect(() => {
    loadMoreReviews();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] w-full">
      <div
        className="flex-1 overflow-y-auto p-4"
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
          if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            hasMore &&
            !loading
          ) {
            loadMoreReviews();
          }
        }}
      >
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}. Please try again.
          </p>
        )}

        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}

        {loading && <LoadingIndicator />}
        {!hasMore && !loading && reviews.length > 0 && <NoMoreReviews />}
        {reviews.length === 0 && !loading && !error && <NoReviews />}
      </div>
    </div>
  );
}

// Review Card Component
const ReviewCard = ({ review }: { review: Review }) => {
  const rating = review?.rating || "Meets Expectations"; // Default rating
  const bgColor = RATING_COLORS[rating] || "bg-gray-200 shadow-gray-300";

  return (
    <div className={`rounded-md mb-6 p-6 shadow-md ${bgColor} transition-all`}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">
          {review?.assessor?.name}
        </h4>
        <p className="text-sm text-gray-500">
          Discussion Date: {review.discussion_date}
        </p>
      </div>
      <div className="space-y-4">
        {[
          "achievements",
          "challenges",
          "goals",
          "skills",
          "comments",
          "rating",
        ].map((field) => (
          <div key={field}>
            <h5 className="text-sm font-semibold text-gray-600">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </h5>
            <p className="text-sm text-gray-800">
              {typeof review[field as keyof Review] === "object"
                ? JSON.stringify(review[field as keyof Review])
                : String(review[field as keyof Review] || "N/A")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Indicator Component
const LoadingIndicator = () => (
  <div className="text-center mt-4 flex flex-col items-center justify-center">
    <div className="loader border-t-2 border-blue-600 border-solid rounded-full w-6 h-6 animate-spin"></div>
    <p className="text-sm text-gray-600 mt-2">Loading...</p>
  </div>
);

// No More Reviews Component
const NoMoreReviews = () => (
  <p className="text-sm text-gray-600 mt-2 text-center">
    No more reviews to load.
  </p>
);

// No Reviews Available Component
const NoReviews = () => (
  <p className="text-sm text-gray-600 mt-2 text-center">
    No reviews available.
  </p>
);
