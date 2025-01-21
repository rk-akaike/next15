import { Review } from "@/types/review";

export default function ReviewList({
  loadMoreReviews,
  reviews,
  currentPage,
  loading,
  hasMore,
  setSelectedEmployee,
  selectedEmployee,
  isLoadingEmployees,
  employees,
}: {
  loadMoreReviews: (page: number) => void;
  reviews: Review[];
  currentPage: number;
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string>>;
  selectedEmployee: string;
  isLoadingEmployees: boolean;
  employees: string[];
}) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      loadMoreReviews(currentPage + 1);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedEmployee(selected);
  };

  if (isLoadingEmployees) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
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
        className="  "
        style={{ maxHeight: "700px", overflowY: "auto" }}
        onScroll={handleScroll}
      >
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
                <h5 className="text-sm font-semibold text-gray-600">
                  Comments
                </h5>
                <p className="text-sm text-gray-800">{review.comments}</p>
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
        {!hasMore && reviews.length === 0 && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            No reviews available.
          </p>
        )}
      </div>
    </div>
  );
}
