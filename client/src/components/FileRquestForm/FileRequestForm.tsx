"use client";

import { apiFetch } from "@/api/apiFetch";
import { useState } from "react";

const FileRequestForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [data, setData] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfs = files.filter((file) => file.type === "application/pdf");
    setSelectedFiles(pdfs);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file)); // multiple files

    try {
      const response = await apiFetch(
        `/file-request/upload`,
        {
          method: "put",
          body: formData,
        }
      );

      formData.entries().forEach(([key, value]) => {
        console.log(`${key}: ${value}`);})

      if (!response.ok) throw new Error("Upload failed");

      alert("Files uploaded successfully!");
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1>Title</h1>
      <p>{title}</p>
      <h1>Descripton</h1>
      <p>{description}</p>
      <h2 className="text-lg font-semibold mb-4">Upload PDF Files</h2>

      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#3BB77E] file:text-white hover:file:bg-[#319b69] transition mb-4"
      />

      {selectedFiles.length > 0 && (
        <ul className="mb-4 space-y-1 text-sm text-gray-600">
          {selectedFiles.map((file, idx) => (
            <li key={idx}>📄 {file.name}</li>
          ))}
        </ul>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="w-full py-2 px-4 text-white bg-[#3BB77E] hover:bg-[#319b69] rounded-md font-semibold transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
};

export default FileRequestForm;
