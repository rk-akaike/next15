"use client";

import { fetchAccessToken } from "@/utils/auth";
import { useState } from "react";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
}

interface TeamEvaluationFormProps {
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  onClose: () => void;
  employees: string[];
  selectedEmployee: string;
}

export default function TeamEvaluationForm({
  setReviews,
  onClose,
  employees,
  selectedEmployee,
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
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2FrYWlrZS5haS9lbWFpbCI6ImthcnRoaWtAYWthaWtldGVjaC5jb20iLCJodHRwczovL2FrYWlrZS5haS9lbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaHR0cHM6Ly9ha2Fpa2UuYWkvZmFtaWx5X25hbWUiOiJSYW1ha3Jpc2huYSIsImh0dHBzOi8vYWthaWtlLmFpL3VzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDExNzA1MjY1OTg3NTYzNjI2MjAzNiIsImh0dHBzOi8vYWthaWtlLmFpL3VzZXJfbWV0YWRhdGEiOnt9LCJodHRwczovL2FrYWlrZS5haS9naXZlbl9uYW1lIjoiVGFuaWtvbmRhIiwiaHR0cHM6Ly9ha2Fpa2UuYWkvc3RhdGUiOiJleUp5WlhSMWNtNVVieUk2SW1oMGRIQTZMeTlzYjJOaGJHaHZjM1E2TXpBd01DOGlmUSIsImlzcyI6Imh0dHBzOi8vcGRmY2hhdC51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTcwNTI2NTk4NzU2MzYyNjIwMzYiLCJhdWQiOlsiaHR0cHM6Ly9wZGZjaGF0LnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaHR0cHM6Ly9wZGZjaGF0LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MzczNTQxODEsImV4cCI6MTczNzQ0MDU4MSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6Im5oRTJxYm5kcHpsT24yMFlEV2xPTGZGejVkR3E3cW4yIn0.dCJRousRGaReHYLxNeUMoSikfGY5nmoaXaZgRun0pFb5pMjeir4NuYlLROcjTEDQGWNVfc08Q-kIQbnxEq3NS3slsygkk_fRz7gifu1pFFopOtd8AC1Tkou2ystnzNNRf_0v36JF75Dg8V1xJDqXDXhmiQMeY3Pgv6M1B95g5xQkD_pZU6aLSAgw8OY5r8rLYQe7IPJAKkmfztXBmbgU-w9EOggYrahvwkzLFfTOSx0DXXYoXywcuBlnoOkt8IhMgTwU2Hf934_cyGFuC4KyEuTaXhw_Di8ZVci-X_JkAMP1ZRDjB-l6r6gV7pmrlaeaowXE7Qv4cYJ-aLRlNf6ZmQ`,
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
      setReviews((prev: any) => [...prev, evaluation]);
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
