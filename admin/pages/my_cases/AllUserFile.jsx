import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAxios } from "../../services/useAxios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

function AllUserFile() {
  const [caseFiles, setCaseFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseFiles = async () => {
      try {
        const res = await useAxios("/showOwnCaseFile/allCaseFile");
        setCaseFiles(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching case files:", err);
        setError("Failed to load case files.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseFiles();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Case Files
      </h2>

      {loading && (
        <p className="text-center text-gray-500">Loading case files...</p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && caseFiles.length === 0 && (
        <p className="text-center text-gray-600">No case files found.</p>
      )}

      <div className="">
        {caseFiles.map((file) => (
          <div
            key={file._id}
            className="relative bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300 mb-4 md:mb-6 lg:mb-8"
          >
            {/* Action icons */}
            <div className="absolute top-3 right-3 flex space-x-3">
              <Link
                to={`/advocate/dashboard/edit-user-file/${file._id}`}
                className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                title="Edit Case"
              >
                <FaEdit />
              </Link>
              <button
                onClick={() => handleDelete(file._id)}
                className="text-red-600 hover:text-red-800 transition cursor-pointer"
                title="Delete Case"
              >
                <FaTrash />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-blue-700 mb-1">
              {file.title || "Untitled Case"}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Case No:{" "}
              <span className="text-gray-800 font-medium">
                {file.case_number || "N/A"}
              </span>
            </p>

            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium text-gray-700">Type:</span>{" "}
                {file.case_type || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Court:</span>{" "}
                {file.court_name || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    file.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : file.status === "closed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {file.status}
                </span>
              </p>
              <p className="line-clamp-3">
                <span className="font-medium text-gray-700">Summary:</span>{" "}
                {file.summary || "-"}
              </p>
              <p>
                <span className="font-medium text-gray-700">Filed:</span>{" "}
                {new Date(file.filing_date).toLocaleDateString()}
              </p>
            </div>

            {/* Tags */}
            {file.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {file.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllUserFile;
