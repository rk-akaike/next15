"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { fetchAccessToken } from "@/utils/auth";
import { Review } from "@/types/review";

const REVIEWS_PER_PAGE = 4;

const ManagerEvaluation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<string[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const loadMoreReviews = async (page: number) => {
    // if (!loading || !hasMore) return; // Prevent duplicate calls
    setLoading(true);
    setError(null);

    try {
      const token = await fetchAccessToken();
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/feedback?page=${page}&limit=${REVIEWS_PER_PAGE}&offset=${4}&reportee_email=${selectedEmployee}`,
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
      const newReviews = data.results;

      if (newReviews.length === reviews.length) {
        setHasMore(false); // No more data to fetch
      } else {
        setReviews(newReviews);
        setCurrentPage(page + 1); // Update the current page only after a successful fetch
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const token = await fetchAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reportees`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch employees.");
      }

      const data = await response.json();
      setEmployees(data.reportees);
      setSelectedEmployee(data.reportees[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const getEmployeeAndReviews = async () => {
    if (employees.length === 0) await getEmployees();
    await loadMoreReviews(1);
  };

  useEffect(() => {
    getEmployeeAndReviews();
  }, [selectedEmployee]);

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Manager Evaluation
        </h2>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Reviews</h3>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 flex items-center"
            onClick={openModal}
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Review
          </button>
        </div>
        <ReviewList
          loadMoreReviews={loadMoreReviews}
          reviews={reviews}
          currentPage={currentPage}
          loading={loading}
          hasMore={hasMore}
          error={error}
          setSelectedEmployee={setSelectedEmployee}
          selectedEmployee={selectedEmployee}
          isLoadingEmployees={isLoadingEmployees}
          employees={employees}
        />
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h3 className="text-lg font-bold mb-4">Create Manager Evaluation</h3>
          <ReviewForm
            onClose={closeModal}
            setReviews={setReviews}
            employees={employees}
            selectedEmployee={selectedEmployee}
          />
        </Modal>
      </div>
    </div>
  );
};

export default withPageAuthRequired(ManagerEvaluation);
