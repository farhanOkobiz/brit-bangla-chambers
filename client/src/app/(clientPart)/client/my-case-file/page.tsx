"use client";
import { apiFetch } from "@/api/apiFetch";
import { CaseItem } from "@/types/caseFile.type";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FileText,
  Calendar,
  Gavel,
  Users,
  Scale,
  ExternalLink,
  Tag,
  BookOpen,
} from "lucide-react";

function page() {
  const [caseData, setCaseData] = useState<CaseItem[]>([]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "closed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    const fetchCaseFile = async () => {
      try {
        const res = await apiFetch("/showOwnCaseFile/singleCaseFile");
        setCaseData(res?.data?.data || []);
      } catch (err) {
        toast.error("Something went wrong");
      }
    };

    fetchCaseFile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Case Files</h1>
          </div>
          <p className="text-gray-600 text-center">
            Manage and track all your legal cases
          </p>
        </div>

        {/* Cases Grid */}
        {caseData?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No cases found
            </h3>
            <p className="text-gray-600">
              Your case files will appear here when you add them.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-1">
            {caseData?.map((caseItem) => (
              <div
                key={caseItem._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {caseItem.title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        caseItem.status
                      )}`}
                    >
                      {caseItem.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{caseItem.case_number}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Filed:{" "}
                        {new Date(caseItem.filing_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    {caseItem.summary}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-5">
                  {/* Parties */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">
                        Parties Involved
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <p className="text-xs font-medium text-red-700 mb-1">
                          PLAINTIFF
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {caseItem.parties.plaintiff.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {caseItem.parties.plaintiff.contact}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs font-medium text-blue-700 mb-1">
                          DEFENDANT
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {caseItem.parties.defendant.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {caseItem.parties.defendant.contact}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Judgment (if exists) */}
                  {caseItem.judgment && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Gavel className="w-4 h-4 text-green-600" />
                        <h3 className="font-semibold text-green-900">
                          Judgment
                        </h3>
                      </div>
                      <p className="text-sm text-green-800 mb-2">
                        <strong>Decision Date:</strong>{" "}
                        {new Date(
                          caseItem.judgment.decision_date
                        ).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-green-700 mb-3">
                        {caseItem.judgment.decision_summary}
                      </p>
                    </div>
                  )}

                  {/* Documents */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Documents</h3>
                    </div>
                    <div className="space-y-2">
                      {caseItem.documents.map((doc) => (
                        <a
                          key={doc._id}
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <FileText className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                          <span className="text-sm text-gray-700 group-hover:text-blue-600 flex-1">
                            {doc.filename}
                          </span>
                          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Case Type:</strong> {caseItem.case_type}
                      </p>
                      <p className="text-gray-600">
                        <strong>Court:</strong> {caseItem.court_name}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Tag className="w-3 h-3 text-gray-500" />
                          <strong className="text-gray-600">Tags:</strong>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {caseItem.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <BookOpen className="w-3 h-3 text-gray-500" />
                          <strong className="text-gray-600">
                            Related Laws:
                          </strong>
                        </div>
                        <p className="text-gray-600">
                          {caseItem.related_laws.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
