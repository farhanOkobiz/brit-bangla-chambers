"use client";

import { apiFetch } from "@/api/apiFetch";
import { useEffect, useState } from "react";

const FileRequestForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [requestData, setRequestData] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle PDF selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfs = files.filter((file) => file.type === "application/pdf");
    setSelectedFiles(pdfs);
    setError("");
    setSuccess("");
  };

  // Upload selected files
  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await apiFetch(`/file-request/upload`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setSuccess("Files uploaded successfully!");
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  // Fetch request info (title & description)
  const fetchRequestData = async () => {
    try {
      const response = await apiFetch(`/file-request/clientId`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file request data.");
      }

      setRequestData(response.data || {});
    } catch (err) {
      console.error(err);
      setError("Could not fetch file request info.");
    }
  };

  useEffect(() => {
    fetchRequestData();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Request Title
        </h2>
        <p className="text-gray-600">
          {requestData.title || "No title available"}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Description
        </h2>
        <p className="text-gray-600 whitespace-pre-line">
          {requestData.description || "No description provided."}
        </p>
      </div>

      <div>
        <label className="block text-gray-800 font-medium mb-2">
          Select PDF files
        </label>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#3BB77E] file:text-white hover:file:bg-[#319b69] transition"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-md border text-sm text-gray-700 space-y-1">
          <h3 className="font-medium mb-1">Selected Files:</h3>
          <ul className="list-disc list-inside space-y-1">
            {selectedFiles.map((file, idx) => (
              <li key={idx}>📄 {file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="w-full py-2 px-4 bg-[#3BB77E] text-white font-semibold rounded-md hover:bg-[#319b69] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
};

export default FileRequestForm;
