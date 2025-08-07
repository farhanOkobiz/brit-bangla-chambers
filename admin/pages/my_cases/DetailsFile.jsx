import { useState, useEffect, useCallback } from "react";
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
  FaSpinner,
} from "react-icons/fa";
import Swal from "sweetalert2";

function DetailsFile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const image_url = import.meta.env.VITE_API_IMAGE_URL;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDocId, setEditingDocId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Status color mapping
  const statusColors = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    closed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Memoized data fetching
  const fetchCase = useCallback(async () => {
    try {
      setLoading(true);
      const res = await UseAxios(`/showOwnCaseFile/singleCaseFile/${id}`);
      if (res.data?.success) {
        setFile(res.data.data);
      } else {
        throw new Error(res.data?.message || "Failed to load case file");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Failed to load case file");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  // Document operations
  const handleDeleteDocument = async (docId) => {
    const result = await Swal.fire({
      title: "Delete Document?",
      text: "This document will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await UseAxios(
          `/showOwnCaseFile/deleteDocument/${id}/documents/${docId}`,
          { method: "DELETE" }
        );

        setFile((prev) => ({
          ...prev,
          documents: prev.documents.filter((doc) => doc._id !== docId),
        }));

        toast.success("Document deleted successfully!");
      } catch (error) {
        console.error("Delete document error:", error);
        toast.error("Failed to delete document");
      }
    }
  };

  const handleSaveDocumentTitle = async (docId) => {
    if (!newTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      await UseAxios(
        `/showOwnCaseFile/updateDocument/${id}/documents/${docId}`,
        {
          method: "PUT",
          data: { documentTitle: newTitle },
        }
      );

      setFile((prev) => ({
        ...prev,
        documents: prev.documents.map((doc) =>
          doc._id === docId ? { ...doc, documentTitle: newTitle } : doc
        ),
      }));

      setEditingDocId(null);
      toast.success("Document title updated!");
    } catch (error) {
      console.error("Update document title error:", error);
      toast.error("Failed to update document title");
    }
  };

  // File operations
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Case File?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
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
        console.error("Delete case file error:", error);
        toast.error("Failed to delete case file");
      }
    }
  };

  const handleToggleStatus = async () => {
    if (!file) return;

    const newStatus = file.status === "closed" ? "in_progress" : "closed";
    const action = newStatus === "closed" ? "close" : "reopen";

    const result = await Swal.fire({
      title: `Confirm ${action}?`,
      text: `Are you sure you want to ${action} this case?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      // Optimistic update

      setFile((prev) => ({ ...prev, status: newStatus }));

      await UseAxios(`/showOwnCaseFile/changeStatus/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({ status: newStatus }),
      });

      toast.success(`Case ${action}ed successfully!`);
    } catch (error) {
      console.error("Toggle status error:", error);
      setFile((prev) => ({ ...prev }));
      toast.error(`Failed to ${action} case`);
    }
  };

  // File upload handler
  const handleUploadFile = async (e) => {
    e.preventDefault();

    if (!uploadTitle.trim() || !uploadFile) {
      toast.error("Please provide a title and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("documentTitle", uploadTitle);
    formData.append("file", uploadFile);

    setUploading(true);

    try {
      const res = await UseAxios(`/showOwnCaseFile/uploadDocument/${id}`, {
        method: "POST",
        data: formData,
      });

      if (res.data?.success) {
        setFile((prev) => ({
          ...prev,
          documents: [...prev.documents, res.data.document],
        }));
        setShowUploadModal(false);
        setUploadTitle("");
        setUploadFile(null);
        toast.success("File uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return isNaN(date) ? "-" : date.toLocaleDateString();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  // Render error state
  if (error || !file) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Case file not found"}</p>
          <button
            onClick={() => navigate("/advocate/dashboard/all-case-file")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Case File Details
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed view and management for your legal case file
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-200 relative">
            <div className="absolute top-6 right-6 flex flex-col sm:flex-row gap-2">
              <Link
                to={`/advocate/dashboard/request-file/${file._id}`}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                aria-label="Request file"
              >
                <FaRegFileAlt />
              </Link>

              <Link
                to={`/advocate/dashboard/edit-case-file/${file._id}`}
                className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors"
                aria-label="Edit case"
              >
                <FaEdit />
              </Link>

              <button
                onClick={handleToggleStatus}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  file.status === "closed" ? "bg-gray-300" : "bg-blue-600"
                }`}
                aria-label={`Toggle case status - current status: ${file.status}`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    file.status === "closed" ? "translate-x-1" : "translate-x-6"
                  }`}
                />
              </button>

              <button
                onClick={handleDelete}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                aria-label="Delete case"
              >
                <FaTrash />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <FaUser className="text-orange-500" />
              <span className="text-gray-600">Client:</span>
              <span className="font-medium">{file.client_name}</span>
            </div>

            <h2 className="text-2xl font-bold mt-4 mb-2">
              {file.title || "Untitled Case"}
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded">
                {file.case_number}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  statusColors[file.status] || statusColors.default
                }`}
              >
                {file.status?.replace("_", " ")?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoItem
                icon={<FaBalanceScale className="text-blue-500" />}
                label="Type"
                value={file.case_type || "-"}
              />

              <InfoItem
                icon={<FaCalendarAlt className="text-green-500" />}
                label="Filed"
                value={formatDate(file.filing_date)}
              />

              <InfoItem
                icon={<FaGavel className="text-purple-500" />}
                label="Court"
                value={file.court_name || "-"}
              />

              <div className="flex items-start gap-2">
                <FaTag className="text-indigo-500 mt-0.5" />
                <div>
                  <span className="text-gray-600">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {file.tags?.length > 0 ? (
                      file.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Parties Section */}
            {file.parties && (
              <Section title="Parties Involved">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PartySection
                    title="Plaintiff"
                    party={file.parties.plaintiff}
                    color="blue"
                  />
                  <PartySection
                    title="Defendant"
                    party={file.parties.defendant}
                    color="red"
                  />
                </div>
              </Section>
            )}

            {/* Summary */}
            {file.summary && (
              <Section title="Case Summary">
                <p className="text-gray-700 leading-relaxed">{file.summary}</p>
              </Section>
            )}

            {/* Related Laws */}
            {file.related_laws?.length > 0 && (
              <Section title="Related Laws">
                <ul className="list-disc pl-5 space-y-1">
                  {file.related_laws.map((law, index) => (
                    <li key={index} className="text-gray-700">
                      {law}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Documents */}
            <Section
              title="Documents"
              action={
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="ml-2 p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700"
                  aria-label="Upload document"
                >
                  <FaFileContract className="text-lg" />
                </button>
              }
            >
              {file.documents?.length > 0 ? (
                <div className="flex overflow-x-auto pb-3 -mx-1 px-1">
                  <div className="flex space-x-4 min-w-max">
                    {file.documents.map((doc) => (
                      <DocumentCard
                        key={doc._id}
                        doc={doc}
                        isEditing={editingDocId === doc._id}
                        newTitle={newTitle}
                        onTitleChange={setNewTitle}
                        onEdit={() => {
                          setEditingDocId(doc._id);
                          setNewTitle(doc.documentTitle);
                        }}
                        onSave={() => handleSaveDocumentTitle(doc._id)}
                        onCancel={() => setEditingDocId(null)}
                        onDelete={() => handleDeleteDocument(doc._id)}
                        imageUrl={image_url}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No documents uploaded yet
                </p>
              )}
            </Section>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {file.next_hearing_date && (
                <InfoCard
                  icon={<FaCalendarAlt className="text-green-600" />}
                  title="Next Hearing"
                  value={formatDate(file.next_hearing_date)}
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                />
              )}

              {file.verdict_date && (
                <InfoCard
                  icon={<FaGavel className="text-red-600" />}
                  title="Verdict Date"
                  value={formatDate(file.verdict_date)}
                  bgColor="bg-red-50"
                  textColor="text-red-700"
                />
              )}
            </div>

            {/* Judgment */}
            {file.judgment && (
              <Section title="Judgment Details">
                {file.judgment.decision_summary && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Summary:</h4>
                    <p className="text-gray-600">
                      {file.judgment.decision_summary}
                    </p>
                  </div>
                )}

                {file.judgment.decision_date && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">
                      Decision Date:
                    </h4>
                    <p>{formatDate(file.judgment.decision_date)}</p>
                  </div>
                )}

                {file.judgment.court_order_url && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">
                      Court Order:
                    </h4>
                    <a
                      href={file.judgment.court_order_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FaRegFileAlt className="mr-1" />
                      View Court Order
                    </a>
                  </div>
                )}
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <Modal
          onClose={() => !uploading && setShowUploadModal(false)}
          title="Upload Document"
          icon={<FaFileContract className="text-amber-600" />}
        >
          <form onSubmit={handleUploadFile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File *
              </label>
              <input
                type="file"
                className="w-full text-sm"
                onChange={(e) => setUploadFile(e.target.files[0])}
                required
                disabled={uploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center disabled:opacity-75"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Reusable Components
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const Section = ({ title, children, action }) => (
  <div className="bg-gray-50 rounded-xl p-5">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const PartySection = ({ title, party, color }) => (
  <div className={`bg-${color}-50 rounded-lg p-4`}>
    <h4 className={`font-medium text-${color}-600 mb-2`}>{title}</h4>
    <div className="ml-3">
      <p className="text-gray-700">{party?.name || "N/A"}</p>
      {party?.contact && (
        <p className="text-gray-600 text-sm mt-1">Contact: {party.contact}</p>
      )}
    </div>
  </div>
);

const InfoCard = ({ icon, title, value, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl p-4 flex items-center gap-3`}>
    {icon}
    <div>
      <h4 className={`font-medium ${textColor}`}>{title}</h4>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const DocumentCard = ({
  doc,
  isEditing,
  newTitle,
  onTitleChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  imageUrl,
}) => (
  <div className="relative w-36">
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      {!isEditing && (
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={onEdit}
            className="text-blue-500 bg-white rounded p-1 hover:bg-blue-50"
            aria-label="Edit document title"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 bg-white rounded p-1 hover:bg-red-50"
            aria-label="Delete document"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="bg-amber-100 p-3 rounded-full mb-2">
          <FaFileContract className="text-amber-600 text-xl" />
        </div>

        {isEditing ? (
          <div className="w-full">
            <input
              className="w-full text-xs font-medium text-center text-gray-700 border rounded px-1 py-0.5 mb-1"
              value={newTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              autoFocus
              aria-label="Edit document title"
            />
            <div className="flex justify-center gap-2">
              <button
                onClick={onSave}
                className="text-xs text-green-600 font-medium hover:text-green-800"
                aria-label="Save changes"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="text-xs text-gray-500 hover:text-gray-700"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <a
            href={`${imageUrl}${doc.documentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center"
            aria-label={`View document: ${doc.documentTitle}`}
          >
            <span className="text-xs font-medium text-gray-700 truncate block w-full">
              {doc.documentTitle}
            </span>
          </a>
        )}
      </div>
    </div>
  </div>
);

const Modal = ({ onClose, title, icon, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
  >
    <div
      className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        onClick={onClose}
        aria-label="Close modal"
        disabled={false}
      >
        &times;
      </button>
      <div className="flex items-center gap-2 text-lg font-bold mb-4 text-amber-700">
        {icon}
        {title}
      </div>
      {children}
    </div>
  </div>
);

export default DetailsFile;
