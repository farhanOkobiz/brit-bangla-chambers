"use client";

import { apiFetch } from "@/api/apiFetch";
import { useEffect, useState } from "react";

interface FileRequest {
  _id: string;
  title?: string;
  description?: string;
}

const FileRequestForm = () => {
  const [fileRequests, setFileRequests] = useState<FileRequest[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>(
    {}
  );
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<
    Record<string, { error?: string; success?: string }>
  >({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});

  const fetchRequests = async () => {
    try {
      const response = await apiFetch(`/file-request/clientId`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch requests.");
      setFileRequests(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFileChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type === "application/pdf"
    );
    setSelectedFiles((prev) => ({ ...prev, [id]: files }));
    setMessages((prev) => ({ ...prev, [id]: {} }));
  };

  const handleDrag = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [id]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [id]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );

      if (files.length !== e.dataTransfer.files.length) {
        setMessages((prev) => ({
          ...prev,
          [id]: {
            error: "Only PDF files are allowed. Some files were filtered out.",
          },
        }));
      } else {
        setMessages((prev) => ({ ...prev, [id]: {} }));
      }

      setSelectedFiles((prev) => ({ ...prev, [id]: files }));
    }
  };

  const handleUpload = async (id: string) => {
    const files = selectedFiles[id];
    if (!files || !files.length) return;

    setUploading((prev) => ({ ...prev, [id]: true }));
    setMessages((prev) => ({ ...prev, [id]: {} }));

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await apiFetch(`/file-request/${id}/upload`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setMessages((prev) => ({
        ...prev,
        [id]: { success: "Files uploaded successfully!" },
      }));
      setSelectedFiles((prev) => ({ ...prev, [id]: [] }));
    } catch (err) {
      console.error(err);
      setMessages((prev) => ({
        ...prev,
        [id]: { error: "Something went wrong while uploading." },
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmDelete) return;

    try {
      const response = await apiFetch(`/file-request/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setFileRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting the request.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            File Upload Center
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Upload your PDF documents for each file request. Track your uploads
            and manage your submissions easily.
          </p>
        </div>

        {/* No Requests State */}
        {fileRequests.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No File Requests Found
            </h3>
            <p className="text-gray-500">
              There are no file requests available at the moment.
            </p>
          </div>
        )}

        {/* File Requests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {fileRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  {req.title || "Untitled Request"}
                </h2>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-5">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {req.description || "No description provided."}
                  </p>
                </div>

                {/* File Upload Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Upload PDF Files
                  </h4>

                  {/* Drag & Drop File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => handleFileChange(req._id, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id={`file-${req._id}`}
                    />
                    <div
                      onDragEnter={(e) => handleDrag(e, req._id)}
                      onDragLeave={(e) => handleDrag(e, req._id)}
                      onDragOver={(e) => handleDrag(e, req._id)}
                      onDrop={(e) => handleDrop(e, req._id)}
                      className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group ${
                        dragActive[req._id]
                          ? "border-emerald-500 bg-emerald-100 scale-105"
                          : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      <div className="text-center pointer-events-none">
                        {dragActive[req._id] ? (
                          <>
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
                              <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <p className="text-emerald-700 font-semibold text-sm">
                              Drop your PDF files here!
                            </p>
                            <p className="text-emerald-600 text-xs mt-1">
                              Release to upload
                            </p>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-10 h-10 text-gray-400 group-hover:text-emerald-500 mx-auto mb-3 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">
                              <span className="font-semibold">
                                Click to browse
                              </span>{" "}
                              or drag & drop files
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF files only • Max 10MB per file
                            </p>
                            <div className="flex items-center justify-center mt-3 space-x-2">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Files Preview */}
                {selectedFiles[req._id]?.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      Selected Files ({selectedFiles[req._id].length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedFiles[req._id].map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <svg
                              className="w-4 h-4 text-red-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <span className="truncate text-gray-700 font-medium">
                              {file.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success & Error Messages */}
                {messages[req._id]?.error && (
                  <div className="flex items-start space-x-3 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <svg
                      className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">
                      {messages[req._id].error}
                    </p>
                  </div>
                )}

                {messages[req._id]?.success && (
                  <div className="flex items-start space-x-3 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z" />
                    </svg>
                    <p className="text-green-700 text-sm font-medium">
                      {messages[req._id].success}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => handleUpload(req._id)}
                    disabled={
                      uploading[req._id] ||
                      !(selectedFiles[req._id]?.length > 0)
                    }
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                  >
                    {uploading[req._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Files
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(req._id)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-200 transition-all duration-200 text-sm sm:text-base"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileRequestForm;
