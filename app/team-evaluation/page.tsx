"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";

import { Review } from "@/types/review";
import { useAuth } from "@clerk/nextjs";
import withAuthGuard from "@/hooks/withAuthGuard";

const ManagerEvaluation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [isLoadingEmployees, setIsLoadingEmployees] = useState<boolean>(true);
  const [employees, setEmployees] = useState<string[]>([]);
  const { getToken } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const getEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const token = await getToken({ template: "custom-token" });
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
      if (data.reportees.length > 0) {
        setSelectedEmployee(data.reportees[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const getEmployeeAndReviews = async () => {
    if (employees.length === 0) await getEmployees();
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
          reviews={reviews}
          setReviews={setReviews}
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

export default withAuthGuard(ManagerEvaluation);
