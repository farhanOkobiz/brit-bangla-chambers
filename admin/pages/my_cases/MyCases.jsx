import React, { useEffect, useState } from "react";
import { useAxios } from "../../services/useAxios";

export default function CreateUserFile() {
  const [acceptedCase, setAcceptedCase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await useAxios("/request-service");
        const acceptedRequests = response?.data?.data.filter(
          (item) => item.status === "accepted"
        );
        setAcceptedCase(acceptedRequests);
      } catch (error) {
        setError("Failed to fetch accepted requests");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestServices();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Accepted Requests
      </h2>

      {loading && (
        <p className="text-center text-gray-500">Loading accepted cases...</p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && acceptedCase.length === 0 && (
        <p className="text-center text-gray-600">No accepted requests found.</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {acceptedCase.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-gray-200 shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-blue-700">
                {item.userMessage?.name || "N/A"}
              </h3>
              <p className="text-sm text-gray-500">
                {item.userMessage?.email || "No email"}
              </p>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <span className="font-medium text-gray-700">Phone:</span>{" "}
                {item.userMessage?.phone || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">NID:</span>{" "}
                {item.userMessage?.nid || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Issue Type:</span>{" "}
                {item.userMessage?.issueType || "-"}
              </p>
              <p className="line-clamp-3">
                <span className="font-medium text-gray-700">Message:</span>{" "}
                {item.userMessage?.message || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Created At:</span>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
