"use client";

import withAuthGuard from "@/hooks/withAuthGuard";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="bg-gray-50 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Welcome to the Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-md font-semibold text-blue-800">
              Self Evaluation
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Complete your self-evaluation for the past month.
            </p>
            <Link
              href="/self-evaluation"
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm inline-block text-center"
            >
              Go to Self Evaluation
            </Link>
          </div>
          <div className="p-6 bg-green-100 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-md font-semibold text-green-800">
              Team Evaluation
            </h3>
            <p className="text-gray-600 mt-2 text-sm">
              Review your team&apos;s performance.
            </p>
            <Link
              href="/team-evaluation"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm inline-block text-center"
            >
              Go to Team Evaluation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthGuard(Dashboard);
