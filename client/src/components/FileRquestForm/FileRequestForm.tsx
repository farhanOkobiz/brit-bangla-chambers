"use client";

import { apiFetch } from "@/api/apiFetch";
import { useEffect, useState } from "react";
import {
  FiUploadCloud,
  FiX,
  FiPlus,
  FiFile,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

interface FileRequest {
  _id: string;
  title?: string;
  description?: string;
}

interface DocumentGroup {
  documentTitle: string;
  files: File[];
}

const FileRequestForm = () => {
  const [fileRequests, setFileRequests] = useState<FileRequest[]>([]);
  const [documentGroups, setDocumentGroups] = useState<DocumentGroup[]>([
    { documentTitle: "", files: [] },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ error?: string; success?: string }>(
    {}
  );

  // Fetch file requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiFetch(`/file-request/clientId`, {
          method: "GET",
        });
        console.log("Fetched file requests:", response.data);
        if (!response.ok) throw new Error("Failed to fetch requests.");
        setFileRequests(response.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, []);

  // Add a new document group
  const handleAddGroup = () => {
    setDocumentGroups((prev) => [...prev, { documentTitle: "", files: [] }]);
  };

  // Remove a document group
  const handleRemoveGroup = (idx: number) => {
    if (documentGroups.length <= 1) return;
    setDocumentGroups((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update title
  const handleTitleChange = (idx: number, value: string) => {
    setDocumentGroups((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, documentTitle: value } : doc))
    );
  };

  // Update files
  const handleFileChange = (idx: number, files: FileList | null) => {
    if (!files) return;
    const pdfFiles = Array.from(files).filter(
      (f) => f.type === "application/pdf"
    );
    setDocumentGroups((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, files: pdfFiles } : doc))
    );
  };

  // Submit all document groups
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({});
    setSubmitting(true);

    // Validation
    for (const doc of documentGroups) {
      if (!doc.documentTitle.trim()) {
        setMessage({ error: "All document titles are required." });
        setSubmitting(false);
        return;
      }
      if (!doc.files.length) {
        setMessage({
          error: "All document groups must have at least one PDF file.",
        });
        setSubmitting(false);
        return;
      }
    }

    // Use the first file request for upload
    const requestId = fileRequests[0]?._id;
    if (!requestId) {
      setMessage({ error: "No file request found to upload documents." });
      setSubmitting(false);
      return;
    }

    try {
      for (const doc of documentGroups) {
        const formData = new FormData();
        formData.append("documentTitle", doc.documentTitle);
        doc.files.forEach((file) => formData.append("files", file));
        const response = await apiFetch(`/file-request/${requestId}/upload`, {
          method: "PUT",
          body: formData,
        });
        if (!response.ok) throw new Error("Upload failed for one group.");
      }
      setMessage({ success: "All documents uploaded successfully!" });
      setDocumentGroups([{ documentTitle: "", files: [] }]);
    } catch {
      setMessage({ error: "Upload failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      {fileRequests.length > 0 ? (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <FiUploadCloud className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {fileRequests[0]?.title}
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              {fileRequests[0]?.description}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h2 className="text-white text-xl font-semibold flex items-center">
                <FiFile className="mr-2" />
                Upload Document Groups
              </h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {documentGroups.map((doc, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-700">
                          Document Group #{idx + 1}
                        </h3>
                        {documentGroups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGroup(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove group"
                          >
                            <FiX size={20} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Document Title{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={doc.documentTitle}
                            onChange={(e) =>
                              handleTitleChange(idx, e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Contracts, Financial Records"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload PDF(s){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="application/pdf"
                              multiple
                              onChange={(e) =>
                                handleFileChange(idx, e.target.files)
                              }
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id={`file-upload-${idx}`}
                              required
                            />
                            <label
                              htmlFor={`file-upload-${idx}`}
                              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <FiUploadCloud className="text-gray-400 text-2xl mb-2" />
                              <p className="text-sm text-gray-600 font-medium mb-1">
                                Click to upload files
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF files only (max 10MB each)
                              </p>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* File previews */}
                      {doc.files.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Selected files:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {doc.files.map((file, fileIdx) => (
                              <div
                                key={fileIdx}
                                className="flex items-center bg-blue-50 rounded-lg px-3 py-2"
                              >
                                <FiFile className="text-blue-500 mr-2 flex-shrink-0" />
                                <span className="text-xs text-gray-700 truncate max-w-[150px]">
                                  {file.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center text-xs text-gray-500">
                        <FiInfo className="mr-1.5 flex-shrink-0" />
                        <p>
                          Group documents under a common title for better
                          organization
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleAddGroup}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <FiPlus className="mr-1" />
                      Add Another Group
                    </button>

                    <div className="flex items-center text-sm text-gray-500">
                      <FiInfo className="mr-1.5" />
                      <span>{documentGroups.length} document groups</span>
                    </div>
                  </div>
                </div>

                {/* Status messages */}
                {message.error && (
                  <div className="mt-6 flex items-start bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <FiAlertCircle className="text-red-500 text-xl mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-700">Upload Error</p>
                      <p className="text-sm text-red-600">{message.error}</p>
                    </div>
                  </div>
                )}

                {message.success && (
                  <div className="mt-6 flex items-start bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <FiCheckCircle className="text-green-500 text-xl mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-700">Success!</p>
                      <p className="text-sm text-green-600">
                        {message.success}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-md transition-all
                    ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    }`}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing Uploads...
                      </div>
                    ) : (
                      "Submit All Document Groups"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <FiInfo className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                No File Requests
              </h1>
              <p className="text-blue-100 max-w-lg mx-auto">
                You don&apos;t have any active file requests at this time
              </p>
            </div>

            <div className="p-8">
              <div className="text-center py-10">
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-24 h-24 flex items-center justify-center">
                    <FiFile className="text-gray-400 text-3xl" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No documents requested
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  You don&apos;t have any active file requests. Please check
                  back later or contact support if you believe this is an error.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <FiRefreshCw className="mr-2" />
                    Refresh Page
                  </button>
                  <button
                    onClick={() => {
                      /* Add contact support functionality */
                    }}
                    className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileRequestForm;
