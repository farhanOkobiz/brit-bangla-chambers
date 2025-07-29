// src/pages/AdvocateFileRequestForm.jsx
import React, { useEffect, useState } from "react";
import { useAxios } from "../../services/useAxios";
import { useParams } from "react-router-dom";

const AdvocateFileRequestForm = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState("");
  const [advocateId, setAdvocateId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");

    if (!formData.title || !formData.description) {
      return setError("Title and description are required.");
    }

    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("client_id", clientId);
      payload.append("advocate_id", advocateId);
      payload.append("case_id", caseId);

      const res = await useAxios("/file-request", {
        method: "post",
        data: payload,
      });

      if (res?.data?._id) {
        setSuccessMsg("File request submitted successfully!");
        setFormData({ title: "", description: "" });
        fetchFileRequests(res.data._id);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit file request.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileRequests = async (requestId) => {
    try {
      const res = await useAxios(`/file-request/case/${requestId}`, {
        method: "get",
      });

      if (Array.isArray(res.data?.file_url)) {
        setFiles(res.data.file_url);
        setShowFiles(true);
      } else {
        setShowFiles(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load file requests.");
    }
  };

  const fetchCaseDetails = async () => {
    try {
      const res = await useAxios(`/showOwnCaseFile/singleCaseFile/${id}`, {
        method: "get",
      });

      setClientId(res.data?.data.client_id);
      setAdvocateId(res.data?.data.advocate_id);
      setCaseId(res.data?.data._id);
      fetchFileRequests(res.data?.data._id);
    } catch (err) {
      console.error(err);
      setError("Failed to load case details.");
    }
  };

  useEffect(() => {
    if (id) fetchCaseDetails();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Submit File Request
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-md mb-4 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block font-semibold text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter request title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block font-semibold text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Enter a short description"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>

        {showFiles && files.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Uploaded Files
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                  >
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvocateFileRequestForm;
