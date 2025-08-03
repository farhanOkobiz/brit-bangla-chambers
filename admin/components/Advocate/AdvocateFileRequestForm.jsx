import React, { useEffect, useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import {
  FaTrashAlt,
  FaFileAlt,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

const AdvocateFileRequestForm = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [clientId, setClientId] = useState("");
  const [advocateId, setAdvocateId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [tickedFiles, setTickedFiles] = useState([]);
  const image_url = import.meta.env.VITE_API_IMAGE_URL;
  const [disabled, setDisabled] = useState(false);
  const [fileGroups, setFileGroups] = useState({});

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
      payload.append("case_number", caseNumber);

      const res = await UseAxios("/file-request", {
        method: "post",
        data: payload,
      });

      if (res?.data?._id) {
        setSuccessMsg("File request submitted successfully!");
        setFormData({ title: "", description: "" });
        fetchFileRequests(res.data.case_id);
        setShowDeleteButton(true);
        setDisabled(true);
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

      if (res.data) {
        setRequestId(res.data._id);
        setFormData({
          title: res.data.title || "",
          description: res.data.description || "",
        });

        // Store document groups
        setDocuments(res.data.documents || []);
        setShowDocuments(res.data.documents?.length > 0);
        setShowDeleteButton(true);
        setDisabled(true);
      } else {
        setShowDocuments(false);
        setShowDeleteButton(false);
        setDisabled(false);
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

      if (res.data?.data) {
        const data = res.data.data;
        setClientId(data.client_id);
        setAdvocateId(data.advocate_id);
        setCaseId(data._id);
        setCaseNumber(data.case_number);
        fetchFileRequests(data._id);

        // Safely get files from case documents
        const caseFiles =
          (data.documents || [])
            .filter((doc) => doc && doc.documentUrl)
            .flatMap((doc) => doc.documentUrl) || [];

        setTickedFiles(caseFiles);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load case details.");
    }
  };

  const handleDeleteFileRequest = async () => {
    if (!window.confirm("Are you sure you want to delete this file request?"))
      return;
    try {
      const res = await UseAxios(`/file-request/${requestId}`, {
        method: "DELETE",
      });

      if (res?.ok) {
        setDisabled(false);
        fetchFileRequests(caseId);
        setFormData({ title: "", description: "" });
        setDocuments([]);
        setSuccessMsg("File request deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting file request:", error);
      setError("Failed to delete file request.");
    }
  };

  const handleDeleteFile = async (fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await UseAxios(`/file-request/${requestId}/file`, {
        method: "delete",
        params: { file_url: fileUrl }, // Send as query parameter
      });

      if (res?.ok) {
        setSuccessMsg("File deleted successfully.");
        fetchFileRequests(caseId);
      } else {
        setError("Failed to delete file.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete file.");
    }
  };

  // When preparing to add files
  const prepareFileGroup = (fileUrl, documentTitle) => {
    setFileGroups((prev) => ({
      ...prev,
      [documentTitle]: [...(prev[documentTitle] || []), fileUrl],
    }));
  };
  
  const handleAddFileToCaseFile = async (documentTitle) => {
    try {
      const fileUrls = fileGroups[documentTitle] || [];

      if (fileUrls.length === 0) {
        setError("Please select files to add");
        return;
      }

      const res = await UseAxios(
        `/showOwnCaseFile/caseFile/${id}/add-document`,
        {
          method: "post",
          data: {
            documentTitle: documentTitle,
            documentUrls: fileUrls,
          },
        }
      );

      if (res?.data?.success) {
        setTickedFiles((prev) => [...prev, ...fileUrls]);
        setSuccessMsg(
          `${fileUrls.length} files added to case file successfully.`
        );
        setFileGroups((prev) => {
          const newGroups = { ...prev };
          delete newGroups[documentTitle];
          return newGroups;
        });
        fetchCaseDetails();
      } else {
        setError("Failed to add files to case file.");
      }
    } catch (error) {
      console.error("Error adding files to case file:", error);
      setError("Failed to add files to case file.");
    }
  };

  useEffect(() => {
    if (id) fetchCaseDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <FaFileAlt className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Submit File Request
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Request files for your case with detailed information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h2 className="text-white font-semibold text-lg">
                  Request Details
                </h2>
              </div>

              <div className="p-6 sm:p-8">
                {/* Alert Messages */}
                {error && (
                  <div className="flex items-start space-x-3 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
                    <FaExclamationCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-red-700 text-sm font-medium">
                      {error}
                    </div>
                  </div>
                )}

                {successMsg && (
                  <div className="flex items-start space-x-3 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-6">
                    <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-green-700 text-sm font-medium">
                      {successMsg}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Request Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="Enter a descriptive title for your request"
                      required
                      disabled={disabled}
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="Provide detailed information about the files you need..."
                      required
                      disabled={disabled}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Be specific about what files you need and why they're
                      important for your case.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {showDeleteButton && (
                      <button
                        type="button"
                        onClick={handleDeleteFileRequest}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-200 transition-all duration-200 text-sm sm:text-base"
                      >
                        <FaTrashAlt className="mr-2" />
                        Delete Request
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || disabled}
                      className="flex items-center justify-center flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : disabled ? (
                        "Request Submitted"
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Files Sidebar */}
          <div className="lg:col-span-1">
            {showDocuments && documents.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                  <h3 className="text-white font-semibold text-lg flex items-center">
                    <FaFileAlt className="mr-2" />
                    Requested Files (
                    {documents.reduce(
                      (total, group) =>
                        total + (group.documentUrl?.length || 0),
                      0
                    )}
                    )
                  </h3>
                </div>

                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {documents
                    .filter((group) => group.documentUrl?.length > 0)
                    .map((docGroup, groupIndex) => (
                      <div
                        key={groupIndex}
                        className="mb-5 last:mb-0 bg-gray-50 rounded-xl p-3 border border-gray-200"
                      >
                        {/* Document Title Header */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-700 text-sm flex items-center">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                              {docGroup.documentUrl?.length || 0}
                            </span>
                            {docGroup.documentTitle}
                          </h4>
                        </div>

                        {/* Files List */}
                        <div className="space-y-2">
                          {docGroup.documentUrl?.map((fileUrl, fileIndex) => {
                            const filename = fileUrl.split("/").pop();
                            const isAdded = tickedFiles.includes(fileUrl);

                            return (
                              <div
                                key={fileIndex}
                                className="group bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 transition-all duration-200"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <a
                                      href={`${image_url}${fileUrl}`}
                                      download
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-blue-600 hover:text-blue-800 font-medium text-sm truncate transition-colors duration-200"
                                      title={filename}
                                    >
                                      {filename}
                                    </a>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDeleteFile(fileUrl)}
                                      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                      title="Delete file"
                                    >
                                      <FaTrashAlt className="text-xs" />
                                    </button>

                                    {!isAdded ? (
                                      <button
                                        onClick={() =>
                                          handleAddFileToCaseFile(
                                            fileUrl,
                                            docGroup.documentTitle
                                          )
                                        }
                                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all duration-200"
                                        title="Add to case file"
                                      >
                                        <TiTick className="text-base" />
                                      </button>
                                    ) : (
                                      <span
                                        className="text-green-500 p-1.5"
                                        title="Added to case"
                                      >
                                        <TiTick className="text-base" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-gray-700 font-semibold mb-2">
                  {showDeleteButton ? "No Files Uploaded" : "No Files Yet"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {showDeleteButton
                    ? "Files will appear here once uploaded"
                    : "Submit a request to see files here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateFileRequestForm;