"use client";

import { apiFetch } from "@/api/apiFetch";
import { useEffect, useState } from "react";

interface DocumentGroup {
  documentTitle: string;
  documentUrl: string[];
}

interface FileRequest {
  _id: string;
  title?: string;
  description?: string;
  documents?: DocumentGroup[];
}

const FileRequestForm = () => {
  const [fileRequests, setFileRequests] = useState<FileRequest[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>(
    {}
  );
  const [documentTitles, setDocumentTitles] = useState<Record<string, string>>(
    {}
  );
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<
    Record<string, { error?: string; success?: string }>
  >({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  const [uploadedRequests, setUploadedRequests] = useState<
    Record<string, boolean>
  >({});


  const fetchRequests = async () => {
    try {
      const response = await apiFetch(`/file-request/clientId`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch requests.");
      setFileRequests(response.data || []);

      // Initialize document titles
      const titles: Record<string, string> = {};
      response.data.forEach((req) => {
        if (req.documents && req.documents.length > 0) {
          titles[req._id] = req.documents[0].documentTitle;
        } else {
          titles[req._id] = "Client Uploads";
        }
      });
      setDocumentTitles(titles);
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

    // Validate document title
    if (!documentTitles[id] || documentTitles[id].trim() === "") {
      setMessages((prev) => ({
        ...prev,
        [id]: { error: "Document title is required" },
      }));
      return;
    }

    setUploading((prev) => ({ ...prev, [id]: true }));
    setMessages((prev) => ({ ...prev, [id]: {} }));

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("documentTitle", documentTitles[id]);

    try {
      const response = await apiFetch(`/file-request/${id}/upload`, {
        method: "PUT",
        body: formData,
      });
      console.log("upload successfully",response.data);
      if (!response.ok) throw new Error("Upload failed");

      // Mark this request as successfully uploaded
      setUploadedRequests((prev) => ({ ...prev, [id]: true }));

      // Clear selected files
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const resetUploadedState = (id: string) => {
    setUploadedRequests((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleTitleChange = (id: string, value: string) => {
    setDocumentTitles((prev) => ({
      ...prev,
      [id]: value,
    }));
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
          {fileRequests.map((req) => {
            if (uploadedRequests[req._id]) {
              return (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                      {req.title || "Untitled Request"}
                    </h2>
                  </div>

                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-emerald-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                      </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Upload Successful!
                    </h3>

                    <p className="text-gray-600 mb-6">
                      Your files for {req.title || "this request"} have been
                      successfully uploaded.
                    </p>

                    <button
                      onClick={() => resetUploadedState(req._id)}
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Upload Again
                    </button>
                  </div>
                </div>
              );
            }

            return (
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

                  {/* Document Title */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Document Title <span className="text-red-500">*</span>
                    </h4>
                    <input
                      type="text"
                      value={documentTitles[req._id] || ""}
                      onChange={(e) =>
                        handleTitleChange(req._id, e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter a title for these documents"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Provide a descriptive title for this group of documents
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

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => handleUpload(req._id)}
                      disabled={
                        uploading[req._id] ||
                        !(selectedFiles[req._id]?.length > 0) ||
                        !documentTitles[req._id]?.trim()
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileRequestForm;
