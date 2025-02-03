"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";
import { Review } from "@/types/review";
import withAuthGuard from "@/hooks/withAuthGuard";

const SelfEvaluation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-6 text-center">Self Evaluation</h2>
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

        <ReviewList reviews={reviews} setReviews={setReviews} />

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <h3 className="text-lg font-bold mb-4">Create Self Evaluation</h3>
          <ReviewForm onClose={closeModal} setReviews={setReviews} />
        </Modal>
      </div>
    </div>
  );
};

export default withAuthGuard(SelfEvaluation);
