import React, { useState, useEffect } from "react";
import {useAxios} from "../../services/useAxios"
import { use } from "react";

export default function CertificationUpdate({ id }) {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState({}); // {idx: File}
  const [advocateId, setAdvocateId] = useState(id);
  const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;

  // Fetch existing certifications for this advocate

  useEffect(() => {
    setAdvocateId(id);
  }
    , [id]);
    
  useEffect(() => {
    async function fetchCerts() {
      setLoading(true);
      setError("");
      try {
        const res = await useAxios( 
            `/certifications/${advocateId}`,
            { method: "GET" }
        );
        console.log("Fetched certifications:", res.data);
        setCertifications(res.data.certifications || []);
      } catch (err) {
        setError("Failed to load certifications");
      }
      setLoading(false);
    }
    if (advocateId) fetchCerts();
  }, [advocateId]);

  // Handle input changes for certification fields
  const handleCertChange = (idx, field, value) => {
    setCertifications((prev) =>
      prev.map((cert, i) =>
        i === idx ? { ...cert, [field]: value } : cert
      )
    );
  };

  // Handle file input
  const handleFileChange = (idx, file) => {
    setFiles((prev) => ({ ...prev, [idx]: file }));
  };

  // Add new certification row
  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      { title: "", issuer: "", year: "", certificate_type: "", description: "" },
    ]);
  };

  // Remove certification row
  const removeCertification = (idx) => {
    setCertifications((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[idx];
      return newFiles;
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("certifications", JSON.stringify(certifications));
      // Track which indexes have files
      const fileIndexes = [];
      certifications.forEach((_, idx) => {
        if (files[idx]) {
          formData.append("certificates", files[idx]);
          fileIndexes.push(idx);
        }
      });
      // Send the indexes as a field (array or single value)
      if (fileIndexes.length === 1) {
        formData.append("certificateIndexes", fileIndexes[0]);
      } else if (fileIndexes.length > 1) {
        fileIndexes.forEach(i => formData.append("certificateIndexes", i));
      }
      const res = await useAxios(
        `/certifications/${advocateId}`,
        {
          method: "PATCH",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      setSuccess("Certifications updated successfully!");
      setCertifications(res.data.certifications || []);
      setFiles({});
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update certifications"
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl p-6 border rounded-xl bg-white shadow ml-8">
      <h3 className="text-xl font-bold mb-4">Certifications</h3>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        {certifications.map((cert, idx) => (
          <div key={idx} className="mb-4 border-b pb-4">
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 w-1/2"
                placeholder="Title"
                value={cert.title}
                onChange={(e) =>
                  handleCertChange(idx, "title", e.target.value)
                }
                required
              />
              <input
                className="border rounded px-2 py-1 w-1/2"
                placeholder="Issuer"
                value={cert.issuer}
                onChange={(e) =>
                  handleCertChange(idx, "issuer", e.target.value)
                }
                required
              />
            </div>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 w-1/3"
                placeholder="Year"
                type="number"
                value={cert.year}
                onChange={(e) =>
                  handleCertChange(idx, "year", e.target.value)
                }
                required
              />
              <input
                className="border rounded px-2 py-1 w-1/3"
                placeholder="Type"
                value={cert.certificate_type}
                onChange={(e) =>
                  handleCertChange(idx, "certificate_type", e.target.value)
                }
              />
              <input
                className="border rounded px-2 py-1 w-1/3"
                placeholder="Description"
                value={cert.description}
                onChange={(e) =>
                  handleCertChange(idx, "description", e.target.value)
                }
              />
            </div>
            <div className="flex gap-2 items-center mb-2">
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) =>
                  handleFileChange(idx, e.target.files[0])
                }
              />
              {cert.certificate_url && 
                <img
                  src={`${IMAGE_URL}${cert.certificate_url}`}
                  alt="Certificate"
                  className="w-16 h-16 object-cover rounded"
                />
              }
              <button
                type="button"
                className="text-red-600 ml-2"
                onClick={() => removeCertification(idx)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 mb-4"
          onClick={addCertification}
        >
          + Add Certification
        </button>
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Certifications"}
          </button>
        </div>
      </form>
    </div>
  );
}