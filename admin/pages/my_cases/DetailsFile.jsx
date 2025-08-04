import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UseAxios } from "../../services/UseAxios";
import {
  FaCalendarAlt,
  FaEdit,
  FaGavel,
  FaRegFileAlt,
  FaTrash,
  FaUser,
  FaTag,
  FaBalanceScale,
  FaFileContract,
} from "react-icons/fa";
import Swal from "sweetalert2";

function DetailsFile() {
  const { id } = useParams();
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  const image_url = import.meta.env.VITE_API_IMAGE_URL;
  const [editingIndex, setEditingIndex] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "closed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This case file will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await UseAxios(`/showOwnCaseFile/deleteCaseFile/${id}`, {
          method: "DELETE",
        });

        toast.success("Case file deleted successfully!");
        navigate("/advocate/dashboard/all-case-file");
      } catch (error) {
        console.error("Error deleting case file:", error);
        toast.error("Failed to delete the case file.");
      }
    }
  };

  const handleDeleteDocument = async (index) => {
    const docId = file.documents[index]._id;
    const result = await Swal.fire({
      title: "Delete Document?",
      text: "This document will be permanently removed from the case file!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await UseAxios(
          `/showOwnCaseFile/deleteDocument/${id}/documents/${docId}`,
          {
            method: "DELETE",
          }
        );

        setFile((prev) => ({
          ...prev,
          documents: prev.documents.filter((doc) => doc._id !== docId),
        }));

        toast.success("Document deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete document.");
        console.error(error);
      }
    }
  };

  const handleEditDocument = (index, currentTitle) => {
    setEditingIndex(index);
    setNewTitle(currentTitle);
  };

  const handleSaveDocumentTitle = async (docId) => {
    try {
      await UseAxios(
        `/showOwnCaseFile/updateDocument/${id}/documents/${docId}`,
        {
          method: "PUT",
          data: { documentTitle: newTitle },
        }
      );
      setFile((prev) => {
        const updatedDocs = prev.documents.map((doc) =>
          doc._id === docId ? { ...doc, documentTitle: newTitle } : doc
        );
        return { ...prev, documents: updatedDocs };
      });
      setEditingIndex(null);
      toast.success("Document title updated!");
    } catch (error) {
      toast.error("Failed to update document title.");
    }
  };

  const handleToggleStatus = async (currentStatus) => {
    const newStatus = currentStatus === "closed" ? "in_progress" : "closed";
    const actionText = newStatus === "closed" ? "close" : "activate";
    const successText = newStatus === "closed" ? "closed" : "activated";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This case file will be ${successText}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      // Optimistic UI update for single file
      setFile((prev) => ({ ...prev, status: newStatus }));

      const res = await UseAxios(`/showOwnCaseFile/changeStatus/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ status: newStatus }),
      });

      if (res.data?.success) {
        toast.success(`Case file ${successText} successfully!`);
        Swal.fire({
          title: `${
            successText.charAt(0).toUpperCase() + successText.slice(1)
          }!`,
          text: `Your case file has been ${successText}.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(
          res.data?.message || `Failed to ${actionText} case file`
        );
      }
    } catch (error) {
      // Revert on error
      setFile((prev) => ({ ...prev, status: currentStatus }));

      console.error(`Error ${actionText}ing case file:`, error);
      toast.error(error.message || `Failed to ${actionText} the case file.`);
    }
  };

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await UseAxios(`/showOwnCaseFile/singleCaseFile/${id}`);
        const data = res.data?.data;
        console.log("Fetched case file:", data);
        setFile(data);
      } catch {
        toast.error("Failed to load case file.");
      }
    };

    fetchCase();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Case Files Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Efficiently manage and track all your legal case files in one
            centralized location
          </p>
        </div>

        {/* Case Files Grid */}
        <div className="mt-10">
          <div
            key={file._id}
            className="bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 mt-4"
          >
            {/* Card Header */}
            <div className="p-6 relative">
              <div className="absolute lg:top-6 right-4 flex items-center space-x-2 transition-opacity duration-200">
                <Link
                  to={`/advocate/dashboard/request-file/${file?._id}`}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 rounded-lg transition-colors duration-200"
                >
                  <FaRegFileAlt className="text-sm" />
                </Link>

                <Link
                  to={`/advocate/dashboard/edit-case-file/${file?._id}`}
                  className="p-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-700 rounded-lg transition-colors duration-200"
                  title="Edit Case"
                >
                  <FaEdit className="text-sm" />
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(file.status);
                  }}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    file.status === "closed" ? "bg-gray-300" : "bg-blue-600"
                  }`}
                  title={
                    file.status === "closed" ? "Activate case" : "Close case"
                  }
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      file.status === "closed"
                        ? "translate-x-1"
                        : "translate-x-6"
                    }`}
                  />
                </button>
                <button
                  onClick={() => handleDelete(file?._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200 cursor-pointer"
                  title="Delete Case"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>

              <div className="flex items-start gap-2 mt-12 lg:mt-0">
                <FaUser className="text-orange-500 mt-0.5" />
                <div>
                  <span className="text-gray-600">Client Name:</span>
                  <span className="font-medium text-gray-800 ml-1">
                    {file.client_name}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 mt-3 lg:mt-6 leading-tight">
                {file?.title || "Untitled Case"}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{file?.case_number}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    file?.status
                  )}`}
                >
                  {file?.status?.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaBalanceScale className="text-blue-500" />
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-800">
                    {file?.case_type || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="text-gray-600">Filed:</span>
                  <span className="font-medium text-gray-800">
                    {file?.filing_date
                      ? new Date(file.filing_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaGavel className="text-purple-500" />
                  <span className="text-gray-600">Court:</span>
                  <span className="font-medium text-gray-800">
                    {file?.court_name || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTag className="text-indigo-500" />
                  <span className="text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {file?.tags?.length > 0 ? (
                      file.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Parties */}
              {file.parties && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Parties Involved
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-600 font-medium">
                        Plaintiff:
                      </span>
                      <div className="mt-1 ml-4">
                        <p className="text-gray-700">
                          {file?.parties?.plaintiff?.name || "N/A"}
                        </p>
                        {file?.parties?.plaintiff?.contact && (
                          <p className="text-gray-600 text-sm">
                            Contact: {file.parties.plaintiff.contact}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">
                        Defendant:
                      </span>
                      <div className="mt-1 ml-4">
                        <p className="text-gray-700">
                          {file?.parties?.defendant?.name || "N/A"}
                        </p>
                        {file?.parties?.defendant?.contact && (
                          <p className="text-gray-600 text-sm">
                            Contact: {file.parties.defendant.contact}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              {file.summary && (
                <div className="text-sm bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">
                    Case Summary
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {file?.summary}
                  </p>
                </div>
              )}

              {/* Related Laws */}
              {file.related_laws?.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 text-sm">
                  <h4 className="font-semibold text-purple-700 mb-2">
                    Related Laws
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {file.related_laws.map((law, index) => (
                      <li key={index} className="text-gray-700">
                        {law}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents */}
              {file.documents?.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 text-sm">
                  <h4 className="font-semibold text-amber-700 mb-3">
                    Documents
                  </h4>
                  <div className="flex overflow-x-auto pb-3 -mx-1 px-1">
                    <div className="flex space-x-4 min-w-max">
                      {file.documents.map((doc, index) => (
                        <div
                          key={doc._id || index}
                          className="relative flex flex-col items-center w-32"
                        >
                          <div className="flex flex-col items-center bg-white border border-amber-200 rounded-lg p-3 w-full hover:shadow-md transition-all duration-200">
                            {/* Action buttons: always visible, top-right */}
                            <div className="absolute top-0 right-0 mt-1 mr-1 flex space-x-1 z-10">
                              {editingIndex !== index && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditDocument(index, doc.documentTitle)
                                  }
                                  className="text-blue-500 text-xs bg-white rounded p-1 hover:bg-blue-50"
                                  title="Edit document title"
                                  aria-label="Edit document title"
                                >
                                  <FaEdit />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(index)}
                                className="text-red-500 text-xs bg-white rounded p-1 hover:bg-red-50"
                                title="Delete document"
                                aria-label="Delete document"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            {editingIndex === index ? (
                              <div className="w-full flex flex-col items-center">
                                <div className="bg-amber-100 p-3 rounded-full mb-2">
                                  <FaFileContract className="text-amber-600 text-xl" />
                                </div>
                                <input
                                  className="text-xs font-medium text-center text-gray-700 truncate w-full border rounded px-1"
                                  value={newTitle}
                                  onChange={(e) => setNewTitle(e.target.value)}
                                  autoFocus
                                  aria-label="Edit document title"
                                />
                                <div className="flex justify-center gap-1 mt-1">
                                  <button
                                    type="button"
                                    className="text-green-600 text-xs font-bold"
                                    onClick={() =>
                                      handleSaveDocumentTitle(doc._id)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-400 text-xs"
                                    onClick={() => setEditingIndex(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <a
                                href={`${image_url}${doc.documentUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center w-full"
                              >
                                <div className="bg-amber-100 p-3 rounded-full mb-2">
                                  <FaFileContract className="text-amber-600 text-xl" />
                                </div>
                                <span className="text-xs font-medium text-center text-gray-700 truncate w-full">
                                  {doc.documentTitle}
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Next Hearing Date */}
                {file.next_hearing_date && (
                  <div className="bg-green-50 rounded-xl p-4 text-sm">
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-green-600" />
                      Next Hearing
                    </h4>
                    <p className="font-medium">
                      {new Date(file.next_hearing_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Verdict Date */}
                {file.verdict_date && (
                  <div className="bg-red-50 rounded-xl p-4 text-sm">
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center">
                      <FaGavel className="mr-2 text-red-600" />
                      Verdict Date
                    </h4>
                    <p className="font-medium">
                      {new Date(file.verdict_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Judgment */}
              {file.judgment && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                  <h4 className="font-semibold text-emerald-800 mb-2">
                    Judgment Details
                  </h4>

                  {file.judgment.decision_summary && (
                    <div className="mb-3">
                      <p className="font-medium text-gray-700">Summary:</p>
                      <p className="text-gray-600 mt-1">
                        {file.judgment.decision_summary}
                      </p>
                    </div>
                  )}

                  {file.judgment.decision_date && (
                    <div className="mb-3">
                      <p className="font-medium text-gray-700">
                        Decision Date:
                      </p>
                      <p>
                        {new Date(
                          file.judgment.decision_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {file.judgment.court_order_url && (
                    <div>
                      <p className="font-medium text-gray-700">Court Order:</p>
                      <a
                        href={file.judgment.court_order_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center mt-1"
                      >
                        <FaRegFileAlt className="mr-1" /> View Court Order
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsFile;
