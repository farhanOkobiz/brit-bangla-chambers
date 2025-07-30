// src/pages/AdvocateFileRequestForm.jsx
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useAxios } from "../../services/UseAxios";
=======
import { UseAxios } from "../../services/UseAxios";
>>>>>>> development
import { useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const AdvocateFileRequestForm = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState("");
  const [advocateId, setAdvocateId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [requestId, setRequestId] = useState("");
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

      const res = await UseAxios("/file-request", {
        method: "post",
        data: payload,
      });

      if (res?.data?._id) {
        setSuccessMsg("File request submitted successfully!");
        setFormData({ title: "", description: "" });
        fetchFileRequests(res.data.case_id); // get latest list
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit file request.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileRequests = async (caseId) => {
    try {
      const res = await UseAxios(`/file-request/case/${caseId}`, {
        method: "get",
      });
      setRequestId(res.data._id);

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
      const res = await UseAxios(`/showOwnCaseFile/singleCaseFile/${id}`, {
        method: "get",
      });

      const data = res.data?.data;
      setClientId(data.client_id);
      setAdvocateId(data.advocate_id);
      setCaseId(data._id);
      fetchFileRequests(data._id);
    } catch (err) {
      console.error(err);
      setError("Failed to load case details.");
    }
  };

  const handleDeleteFile = async (fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

<<<<<<< HEAD
    try {
      const res = await useAxios(`/file-request/${requestId}/file`, {
        method: "delete",
        data: { file_url: fileUrl }, // ✅ This is the correct way
      });
=======
   try {
     const res = await UseAxios(`/file-request/${requestId}/file`, {
       method: "delete",
       data: { file_url: fileUrl }, // ✅ This is the correct way
     });

     if (res?.data?.fileRequest) {
       setFiles((prevFiles) => prevFiles.filter((file) => file !== fileUrl));
       setSuccessMsg("File deleted successfully.");
     }
     if(res.ok){
      fetchFileRequests(caseId);
     } else {
       setError("Failed to delete file.");
     }
   } catch (err) {
     console.error(err);
     setError("Failed to delete file.");
   }
 };
>>>>>>> development

      if (res?.data?.fileRequest) {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileUrl));
        setSuccessMsg("File deleted successfully.");
      }
      if (res.ok) {
        fetchFileRequests(caseId);
      } else {
        setError("Failed to delete file.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete file.");
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
            <ul className="space-y-3">
              {files.map((file, index) => {
                const filename = file.split("/").pop();

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {filename}
                    </a>

                    <button
                      onClick={() => handleDeleteFile(filename)}
                      className="ml-4 text-red-500 hover:text-red-700"
                      title="Delete file"
                    >
                      <FaTrashAlt />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvocateFileRequestForm;
