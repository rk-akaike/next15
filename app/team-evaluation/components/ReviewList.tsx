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
import { RATING_COLORS, REVIEWS_PER_PAGE } from "@/constants";

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
  const [offset, setOffset] = useState(0);
  const { getToken } = useAuth();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedEmployee(selected);
    setHasMore(true);
    setOffset(0);
    loadMoreReviews(0, true, selected);
  };

  const loadMoreReviews = useCallback(
    async (
      offset: number,
      reset = false,
      employeeEmail: string = selectedEmployee
    ) => {
      if (loading || (!hasMore && !reset)) return;
      setLoading(true);
      setError(null);

      try {
        const token = await getToken({ template: "custom-token" });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback?offset=${offset}&limit=${REVIEWS_PER_PAGE}&reportee_email=${employeeEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch reviews.");

        const data = await response.json();
        const { results: newReviews, count } = data;

        if (reset) {
          setReviews(newReviews);
        } else {
          setReviews((prev) => [...prev, ...newReviews]);
        }

        if (reviews.length + newReviews.length >= count) {
          setHasMore(false);
        }

        setOffset(offset + REVIEWS_PER_PAGE);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, selectedEmployee]
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      loadMoreReviews(offset);
    }
  };

  useEffect(() => {
    if (selectedEmployee) {
      loadMoreReviews(0, true);
    }
  }, [selectedEmployee]);

  if (isLoadingEmployees) {
    return (
      <p className="text-center text-lg font-semibold text-gray-600">
        Loading employees...
      </p>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No Reportees Found
        </h2>
        <p className="text-gray-500">
          You currently have no reportees assigned to you.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col h-[calc(100vh-14rem)]">
      <div className="mb-4">
        <select
          value={selectedEmployee}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 w-1/2"
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
        className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md p-4"
        onScroll={handleScroll}
      >
        {reviews.map((review, index) => {
          const rating = review.rating || "Meets Expectations";
          const bgColor =
            RATING_COLORS[rating] || "bg-gray-200 shadow-gray-300";

          return (
            <div
              key={index}
              className={`rounded-md mb-6 p-6 shadow-md ${bgColor} transition-all`}
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
                {(
                  [
                    "achievements",
                    "challenges",
                    "goals",
                    "skills",
                    "comments",
                  ] as const
                ).map((field) => (
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
        })}

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
