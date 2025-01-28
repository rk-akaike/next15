"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Review } from "@/types/review";
import { fetchAccessToken } from "@/utils/auth";

const REVIEWS_PER_PAGE = 4;

export default function ReviewList({
  reviews,
  setReviews,
  setSelectedEmployee,
  selectedEmployee,
  isLoadingEmployees,
  employees,
}: {
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
  setSelectedEmployee: Dispatch<SetStateAction<string>>;
  selectedEmployee: string;
  isLoadingEmployees: boolean;
  employees: string[];
}) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value; // Get the selected dropdown value

    setSelectedEmployee(selected); // Update the state for future use
    setHasMore(true); // Reset pagination
    setCurrentPage(1); // Reset page count

    // Pass the selected value directly to loadMoreReviews
    loadMoreReviews(1, true, selected);
  };

  const loadMoreReviews = async (
    page: number,
    reset = false,
    employeeEmail: string = selectedEmployee // Default to the current state
  ) => {
    if (loading || (!hasMore && !reset)) return; // Prevent duplicate calls
    setLoading(true);
    setError(null);

    try {
      const token = await fetchAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback?page=${page}&limit=${REVIEWS_PER_PAGE}&reportee_email=${employeeEmail}`,
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
      const { results: newReviews, count } = data;

      if (reset) {
        setReviews(newReviews); // Reset reviews on dropdown change
      } else {
        setReviews((prev) => [...prev, ...newReviews]); // Append new reviews
      }

      setHasMore(page * REVIEWS_PER_PAGE < count); // Determine if more reviews can be loaded
      setCurrentPage(page); // Update the current page
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      loadMoreReviews(currentPage + 1); // Load the next page
    }
  };

  useEffect(() => {
    if (selectedEmployee) {
      loadMoreReviews(1, true); // Initial fetch or on employee change
    }
  }, [selectedEmployee]);

  if (isLoadingEmployees) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading employees...
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            No Reportees Found
          </h2>
          <p className="text-gray-500">
            You currently have no reportees assigned to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <select
          value={selectedEmployee}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 w-1/2"
        >
          <option value="" className="text-gray-500">
            -- Filter by Employee --
          </option>
          {employees.map((employee, index) => (
            <option
              key={index}
              value={employee}
              className="text-gray-700 hover:bg-blue-100"
            >
              {employee}
            </option>
          ))}
        </select>
      </div>

      <div
        className="bg-white rounded-lg shadow-md p-4"
        style={{ maxHeight: "700px", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`rounded-md mb-6 p-6 shadow-sm bg-gradient-to-r from-blue-100 to-blue-50`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                {review?.assessor?.name}
              </h4>
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
                <h5 className="text-sm font-semibold text-gray-600">Rating</h5>
                <p className="text-sm text-gray-800">{review.rating}</p>
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
    </div>
  );
}
