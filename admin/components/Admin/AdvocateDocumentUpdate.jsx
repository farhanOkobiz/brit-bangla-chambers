import React, { useState, useEffect } from "react";
import { useAxios } from "../../services/useAxios";

const AdvocateDocumentUpdate = ({ id }) => {
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState({}); // {idx: File}
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const advocateId = id;
  const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      setError("");
      try {
        const res = await useAxios(
          `/documents/${advocateId}`,
          { method: "GET" }
        );
        setDocuments(res.data.documents || []);
      } catch (err) {
        setError("Failed to load documents");
      }
      setLoading(false);
    }
    if (advocateId) fetchDocuments();
  }, [advocateId]);

  const handleDocChange = (idx, field, value) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, [field]: value } : doc))
    );
  };

  const handleFileChange = (idx, file) => {
    setFiles((prev) => ({ ...prev, [idx]: file }));
  };

  const addDocument = () => {
    setDocuments([...documents, { file_name: "", document_type: "", verified: false }]);
  };

  const removeDocument = (idx) => {
    setDocuments((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[idx];
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("documents", JSON.stringify(documents));
      const documentIndexes = [];
      const fileEntries = Object.entries(files).filter(([idx, file]) => !!file);
      fileEntries.forEach(([idx, file]) => {
        formData.append("files", file);
        documentIndexes.push(Number(idx));
      });
      formData.append("documentIndexes", JSON.stringify(documentIndexes));

      const res = await useAxios(
        `/documents/${advocateId}`,
        {
          method: "PUT",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess("Documents updated successfully!");
      setDocuments(res.data.documents || []);
      setFiles({});
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update documents");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl p-4 rounded-lg bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-md ml-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Documents</h3>
      {success && <div className="text-green-600 mb-2 text-sm font-medium">{success}</div>}
      {error && <div className="text-red-600 mb-2 text-sm font-medium">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {documents.map((doc, idx) => (
            <div key={idx} className="rounded-lg bg-white shadow-sm px-4 py-3 flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-slate-700">Document Name</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Document Name"
                    value={doc.file_name || ""}
                    onChange={(e) => handleDocChange(idx, "file_name", e.target.value)}
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-slate-700">Document Type</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Document Type"
                    value={doc.document_type || ""}
                    onChange={(e) => handleDocChange(idx, "document_type", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="w-full  flex justify-between ">
                  <label className="block text-sm font-mediumtext-slate-700">Upload File</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFileChange(idx, e.target.files[0])}
                    className="file:mr-1 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 text-sm"
                    required={!doc.file_url}
                  />
                  {doc.file_url && (
                  <a
                    href={`${IMAGE_URL}${doc.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-medium text-right text-sm"
                  >
                    View Document
                  </a>

                )}
                </div>
                 
                
                <label className="flex items-center gap-2 ml-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={doc.verified}
                    onChange={(e) => handleDocChange(idx, "verified", e.target.checked)}
                    className="accent-blue-600"
                  /> Verified
                </label>  </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 font-medium ml-2 px-2 py-1 rounded-md bg-red-50 text-sm"
                  onClick={() => removeDocument(idx)}
                >
                  Remove
                </button>
               
            
              
            </div>
          ))}
        </div>
        <button
          type="button"
          className="text-blue-700 font-medium mt-6 mb-3 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition text-sm"
          onClick={addDocument}
        >
          + Add Document
        </button>
        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Documents"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvocateDocumentUpdate;