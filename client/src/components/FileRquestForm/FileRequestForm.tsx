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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
      {fileRequests.map((req) => (
        <div
          key={req._id}
          className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between space-y-5"
        >
          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              {req.title || "Untitled Request"}
            </h2>
            <p className="text-gray-600 text-sm">
              {req.description || "No description provided."}
            </p>
          </div>

          {/* File Input */}
          <div className="mt-2">
            <label className="block font-medium text-gray-800 mb-2">
              Upload PDF files
            </label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => handleFileChange(req._id, e)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-medium file:bg-[#3BB77E] file:text-white hover:file:bg-[#319b69] transition"
            />
          </div>

          {/* Selected Files Preview */}
          {selectedFiles[req._id]?.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 space-y-1">
              <h3 className="font-medium mb-1">Selected Files:</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedFiles[req._id].map((file, idx) => (
                  <li key={idx}>📄 {file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success & Error Messages */}
          {messages[req._id]?.error && (
            <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-md">
              {messages[req._id].error}
            </div>
          )}
          {messages[req._id]?.success && (
            <div className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-md">
              {messages[req._id].success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={() => handleUpload(req._id)}
              disabled={
                uploading[req._id] || !(selectedFiles[req._id]?.length > 0)
              }
              className="w-full py-2 px-4 bg-[#3BB77E] text-white font-semibold rounded-lg hover:bg-[#319b69] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading[req._id] ? "Uploading..." : "Upload Files"}
            </button>

            <button
              onClick={() => handleDelete(req._id)}
              className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Delete Request
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileRequestForm;
