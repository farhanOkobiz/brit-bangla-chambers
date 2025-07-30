import { useState, useEffect } from "react";
import { UseAxios } from "../../services/UseAxios";

export default function AdvocateEducationUpdate({ id }) {
  const [educations, setEducations] = useState([]);
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
    async function fetchEducations() {
      setLoading(true);
      setError("");
      try {
        const res = await UseAxios(`/educations/${advocateId}`, {
          method: "GET",
        });
        setEducations(res.data.educations || []);
      } catch (err) {
        setError("Failed to load education records");
      }
      setLoading(false);
    }
    if (advocateId) fetchEducations();
  }, [advocateId]);

  const handleEduChange = (idx, field, value) => {
    setEducations((prev) =>
      prev.map((edu, i) => (i === idx ? { ...edu, [field]: value } : edu))
    );
  };

  const handleFileChange = (idx, file) => {
    setFiles((prev) => ({ ...prev, [idx]: file }));
  };

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      { degree_title: "", institution: "", passing_year: "" },
    ]);
  };

  const removeEducation = (idx) => {
    setEducations((prev) => prev.filter((_, i) => i !== idx));
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
      formData.append("education", JSON.stringify(educations));
      // Only send files that exist, and their indexes, to match backend logic
      const educationIndexes = [];
      const fileEntries = Object.entries(files).filter(([idx, file]) => !!file);
      fileEntries.forEach(([idx, file]) => {
        formData.append("certificates", file);
        educationIndexes.push(Number(idx));
      });
      formData.append("educationIndexes", JSON.stringify(educationIndexes));
      const res = await UseAxios(`/educations/${advocateId}`, {
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Education records updated successfully!");
      setEducations(res.data.educations || []);
      setFiles({});
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update education records"
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl p-6 border rounded-xl bg-white shadow ml-8">
      <h3 className="text-xl font-bold mb-4">Education</h3>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        {educations.map((edu, idx) => (
          <div key={idx} className="mb-4 border-b pb-4">
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 w-1/2"
                placeholder="Degree Title"
                value={edu.degree_title}
                onChange={(e) =>
                  handleEduChange(idx, "degree_title", e.target.value)
                }
                required
              />
              <input
                className="border rounded px-2 py-1 w-1/2"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) =>
                  handleEduChange(idx, "institution", e.target.value)
                }
                required
              />
            </div>
            <div className="flex gap-2 mb-2">
              <input
                className="border rounded px-2 py-1 w-1/3"
                placeholder="Passing Year"
                type="number"
                value={edu.passing_year}
                onChange={(e) =>
                  handleEduChange(idx, "passing_year", e.target.value)
                }
                required
              />
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => handleFileChange(idx, e.target.files[0])}
              />
              {edu.certificate_url && (
                <img
                  src={`${IMAGE_URL}${edu.certificate_url}`}
                  alt="Certificate"
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <button
                type="button"
                className="text-red-600 ml-2"
                onClick={() => removeEducation(idx)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 mb-4"
          onClick={addEducation}
        >
          + Add Education
        </button>
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Education"}
          </button>
        </div>
      </form>
    </div>
  );
}
