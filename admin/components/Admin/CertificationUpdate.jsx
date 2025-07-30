import React, { useState, useEffect } from "react";
import { UseAxios } from "../../services/UseAxios";

export default function CertificationUpdate({ id }) {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState({}); // {idx: File}
  const [advocateId, setAdvocateId] = useState(id);
  const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

  useEffect(() => {
    setAdvocateId(id);
  }, [id]);

  useEffect(() => {
    async function fetchCerts() {
      setLoading(true);
      setError("");
      try {
        const res = await UseAxios(
          `/certifications/${advocateId}`,
          { method: "GET" }
        );
        setCertifications(res.data.certifications || []);
      } catch {
        setError("Failed to load certifications");
      }
      setLoading(false);
    }
    if (advocateId) fetchCerts();
  }, [advocateId]);

  const handleCertChange = (idx, field, value) => {
    setCertifications((prev) =>
      prev.map((cert, i) => (i === idx ? { ...cert, [field]: value } : cert))
    );
  };

  const handleFileChange = (idx, file) => {
    setFiles((prev) => ({ ...prev, [idx]: file }));
  };

  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      { title: "", issuer: "", year: "", certificate_type: "", description: "" },
    ]);
  };

  const removeCertification = (idx) => {
    setCertifications((prev) => prev.filter((_, i) => i !== idx));
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
      formData.append("certifications", JSON.stringify(certifications));
      const fileIndexes = [];
      certifications.forEach((_, idx) => {
        if (files[idx]) {
          formData.append("certificates", files[idx]);
          fileIndexes.push(idx);
        }
      });
      if (fileIndexes.length === 1) {
        formData.append("certificateIndexes", fileIndexes[0]);
      } else if (fileIndexes.length > 1) {
        fileIndexes.forEach((i) => formData.append("certificateIndexes", i));
      }
      const res = await UseAxios(
        `/certifications/${advocateId}`,
        {
          method: "PATCH",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess("Certifications updated successfully!");
      setCertifications(res.data.certifications || []);
      setFiles({});
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update certifications");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl p-4 rounded-lg bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-md ml-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Certifications</h3>
      {success && <div className="text-green-600 mb-2 text-sm font-medium">{success}</div>}
      {error && <div className="text-red-600 mb-2 text-sm font-medium">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {certifications.map((cert, idx) => (
            <div key={idx} className="rounded-lg bg-white shadow-sm px-4 py-3 flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col md:w-1/2">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Title"
                    value={cert.title}
                    onChange={(e) => handleCertChange(idx, "title", e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col md:w-1/2">
                  <label className="text-sm font-medium text-slate-700">Issuer</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Issuer"
                    value={cert.issuer}
                    onChange={(e) => handleCertChange(idx, "issuer", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <label className="text-sm font-medium text-slate-700">Year</label>
                <input
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                  placeholder="Year"
                  type="number"
                  value={cert.year}
                  onChange={(e) => handleCertChange(idx, "year", e.target.value)}
                  required
                />
                <label className="text-sm font-medium text-slate-700">Type</label>
                <input
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full md:w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                  placeholder="Type"
                  value={cert.certificate_type}
                  onChange={(e) => handleCertChange(idx, "certificate_type", e.target.value)}
                />
                <label className="text-sm font-medium text-slate-700">Description</label>
                <input
                  className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full md:w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                  placeholder="Description"
                  value={cert.description}
                  onChange={(e) => handleCertChange(idx, "description", e.target.value)}
                />
                <div className="flex justify-between ">

              
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => handleFileChange(idx, e.target.files[0])}
                  className="file:mr-1 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 text-sm"
                />
                
                {cert.certificate_url && (
                  <a
                    download={cert.certificate_url}
                    href={`${IMAGE_URL}${cert.certificate_url}`}
                    alt="Certificate"
                    className=" font-sans text-blue-600 hover:text-blue-800 transition text-sm"
                  >
                    View Certificate
                  </a>
                )}
                </div ></div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 font-medium ml-2 px-2 py-1 rounded-md bg-red-50 text-sm"
                  onClick={() => removeCertification(idx)}
                >
                  Remove
                </button>
              
            </div>
          ))}
        </div>
        <button
          type="button"
          className="text-blue-700 font-medium mt-6 mb-3 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition text-sm"
          onClick={addCertification}
        >
          + Add Certification
        </button>
        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Certifications"}
          </button>
        </div>
      </form>
    </div>
  );
}