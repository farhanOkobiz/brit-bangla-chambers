"use client";
import { apiFetch } from "@/api/apiFetch";
import ClientDetailsCaseFile from "@/types/clientDetailsCaseFile.interface";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaGavel, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

function Page() {
  const { id } = useParams();
  const [file, setFile] = useState<ClientDetailsCaseFile | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "closed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await apiFetch(`/showOwnCaseFile/singleCaseFile/${id}`);
        const data = res.data?.data;
        setFile(data);
      } catch {
        toast.error("Failed to load case file.");
      }
    };

    fetchCase();
  }, [id]);

  if (!file) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading case file...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Case Files Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Efficiently manage and track all your legal case files in one
            centralized location
          </p>
        </div>

        {/* Case Files Grid */}
        <div className="mt-10">
          <div
            key={file._id}
            className=" bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 mt-4"
          >
            {/* Card Header */}
            <div className="p-6 relative">
              <div className="absolute lg:top-6 right-4 flex items-center space-x-2 transition-opacity duration-200"></div>
              <div className="flex items-start gap-2">
                <FaUser className="text-orange-500 mt-0.5" />
                <div>
                  <span className="text-gray-600">Client Name:</span>
                  <span className="font-medium text-gray-800 ml-1">
                    {file.client_name}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 mt-6 leading-tight">
                {file?.title || "Untitled Case"}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{file?.case_number}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    file?.status
                  )}`}
                >
                  {file?.status?.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Key Information */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaGavel className="text-blue-500" />
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-800">
                    {file?.case_type || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="text-gray-600">Filed:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(file?.filing_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Court and Client */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <FaGavel className="text-purple-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Court:</span>
                    <span className="font-medium text-gray-800 ml-1">
                      {file?.court_name || "-"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaUser className="text-orange-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium text-gray-800 ml-1">
                      {file?.client_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parties */}
              {file.parties && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Parties Involved
                  </h4>
                  <div>
                    <span className="text-blue-600 font-medium">
                      Plaintiff:
                    </span>
                    <span className="text-gray-700 ml-1">
                      {file?.parties?.plaintiff?.name} (
                      {file?.parties?.plaintiff?.contact})
                    </span>
                  </div>
                  <div>
                    <span className="text-red-600 font-medium">Defendant:</span>
                    <span className="text-gray-700 ml-1">
                      {file?.parties?.defendant?.name} (
                      {file?.parties?.defendant?.contact})
                    </span>
                  </div>
                </div>
              )}

              {/* Summary */}
              {file.summary && (
                <div className="text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Case Summary
                  </h4>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {file?.summary}
                  </p>
                </div>
              )}

              {/* Next Hearing Date */}
              {file.next_hearing_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-blue-600" />
                  <span>Next Hearing:</span>
                  <span className="font-medium">
                    {new Date(file?.next_hearing_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Verdict Date */}
              {file.verdict_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaGavel className="text-green-600" />
                  <span>Verdict Date:</span>
                  <span className="font-medium">
                    {new Date(file?.verdict_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Judgment */}
              {file.judgment?.decision_summary &&
                file.judgment?.decision_date && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Judgment
                    </h4>
                    <p className="text-green-700">
                      {file.judgment.decision_summary}
                    </p>
                    <p>
                      Decision Date:{" "}
                      {new Date(
                        file.judgment.decision_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;
