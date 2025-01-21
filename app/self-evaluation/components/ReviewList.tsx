"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Review } from "@/types/review";
import { fetchAccessToken } from "@/utils/auth";

const REVIEWS_PER_PAGE = 4;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState<number | null>(null); // Total reviews from API response

  const loadMoreReviews = async (page: number) => {
    if (loading || !hasMore) return; // Prevent duplicate calls
    setLoading(true);
    setError(null);

    try {
      const token = await fetchAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback?page=${page}&limit=${REVIEWS_PER_PAGE}`,
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

      const data = await response.json();
      const { results: newReviews, count } = data; // Extract results and count from the response

      // Update total reviews only once, when fetched for the first time
      if (totalReviews === null && count !== undefined) {
        setTotalReviews(count);
      }

      // Check if there are more reviews to load
      if (page * REVIEWS_PER_PAGE >= count) {
        setHasMore(false); // No more data to fetch
      } else {
        setHasMore(true);
      }

      setReviews((prev) => [...prev, ...newReviews]);
      setCurrentPage(page); // Update the current page
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreReviews(1); // Initial fetch
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    // Trigger load more when near the bottom
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      loadMoreReviews(currentPage + 1); // Load the next page
    }
  };

  return (
    <div
      className="container mx-auto"
      style={{ maxHeight: "800px", overflowY: "auto" }}
      onScroll={handleScroll} // Attach scroll handler
    >
      {error && (
        <p className="text-red-500 text-center mb-4">
          {error}. Please try again.
        </p>
      )}
      {reviews.map((review, index) => (
        <div
          key={index}
          className={`rounded-md mb-6 p-6 shadow-sm bg-gradient-to-r from-blue-100 to-blue-50`}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Reviewer</h4>
            <p className="text-sm text-gray-500">
              Discussion Date: {review.discussion_date}
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-semibold text-gray-600">
                Achievements
              </h5>
              <p className="text-sm text-gray-800">{review.achievements}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-600">
                Challenges
              </h5>
              <p className="text-sm text-gray-800">{review.challenges}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-600">Goals</h5>
              <p className="text-sm text-gray-800">{review.goals}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-600">Skills</h5>
              <p className="text-sm text-gray-800">{review.skills}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-600">Comments</h5>
              <p className="text-sm text-gray-800">{review.comments}</p>
            </div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="text-center mt-4 flex flex-col items-center justify-center">
          <div className="loader border-t-2 border-blue-600 border-solid rounded-full w-6 h-6 animate-spin"></div>
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>
      )}
      {!hasMore && !loading && reviews.length > 0 && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          No more reviews to load.
        </p>
      )}
      {reviews.length === 0 && !loading && !error && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          No reviews available.
        </p>
      )}
    </div>
  );
}
