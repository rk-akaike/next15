"use client";

import { Review } from "@/types/review";
import { fetchAccessToken } from "@/utils/auth";
import { useState } from "react";
import { toast } from "react-toastify";

interface TeamEvaluationFormProps {
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  onClose: () => void;
  employees: string[];
  selectedEmployee: string;
}

export default function TeamEvaluationForm({
  setReviews,
  onClose,
  employees,
}: TeamEvaluationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const evaluation = {
      type: "Manager",
      achievements: formData.get("achievements") as string,
      challenges: formData.get("challenges") as string,
      goals: formData.get("goals") as string,
      skills: formData.get("skills") as string,
      comments: formData.get("comments") as string,
      discussion_date: formData.get("discussion_date") as string,
      rating: formData.get("rating") as string,
      assessee: selectedUser,
    };

    try {
      const token = await fetchAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(evaluation),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit the evaluation.");
      }

      toast.success("Evaluation submitted successfully.", {
        position: "top-right",
        autoClose: 4000,
      });
      setReviews((prev) => [...prev, evaluation]);
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      style={{ overflow: "hidden" }}
    >
      <div
        className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg overflow-y-auto "
        style={{ maxHeight: "90vh" }} // Ensure the modal content fits within the viewport
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-full overflow-auto "
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Employee
            </label>
            <select
              name="employee"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                -- Select an Employee --
              </option>
              {employees.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="discussion_date"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Discussion{" "}
              <span className="text-gray-400">(YYYY-MM-DD)</span>
            </label>
            <input
              id="discussion_date"
              name="discussion_date"
              type="date"
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label
              htmlFor="achievements"
              className="block text-sm font-medium text-gray-700"
            >
              Achievements & Contributions{" "}
              <span className="text-gray-400">(Describe key achievements)</span>
            </label>
            <textarea
              id="achievements"
              name="achievements"
              rows={3}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="challenges"
              className="block text-sm font-medium text-gray-700"
            >
              Challenges and Areas of Improvement{" "}
              <span className="text-gray-400">
                (Highlight areas to improve)
              </span>
            </label>
            <textarea
              id="challenges"
              name="challenges"
              rows={3}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="goals"
              className="block text-sm font-medium text-gray-700"
            >
              Goals for Next Month{" "}
              <span className="text-gray-400">(Set specific objectives)</span>
            </label>
            <textarea
              id="goals"
              name="goals"
              rows={3}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700"
            >
              Skills/Initiatives to Get Involved{" "}
              <span className="text-gray-400">
                (Propose skill improvements)
              </span>
            </label>
            <textarea
              id="skills"
              name="skills"
              rows={3}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700"
            >
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={3}
              className="mt-1 block w-full p-2 border rounded-md"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="Unsatisfactory">Unsatisfactory</option>
              <option value="Needs Development">Needs Development</option>
              <option value="Meets Expectations">Meets Expectations</option>
              <option value="Exceeds Expectations">Exceeds Expectations</option>
              <option value="Outstanding">Outstanding</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
