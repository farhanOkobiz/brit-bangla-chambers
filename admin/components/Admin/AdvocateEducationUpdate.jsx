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
        const res = await UseAxios(
          `/educations/${advocateId}`,
          { method: "GET" }
        );
        setEducations(res.data.educations || []);
      } catch {
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
      const fileEntries = Object.entries(files).filter(([idx, file]) =>{
        console.log("idx:", idx, "file:", file);
        return !!file;
      });
      fileEntries.forEach(([idx, file]) => {
        formData.append("certificates", file);
        educationIndexes.push(Number(idx));
      });
      formData.append("educationIndexes", JSON.stringify(educationIndexes));
      const res = await UseAxios(
        `/educations/${advocateId}`,
        {
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess("Education records updated successfully!");
      setEducations(res.data.educations || []);
      setFiles({});
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update education records");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl p-4 rounded-lg bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-md ml-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-800">Education</h3>
      {success && <div className="text-green-600 mb-2 text-sm font-medium">{success}</div>}
      {error && <div className="text-red-600 mb-2 text-sm font-medium">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {educations.map((edu, idx) => (
            <div key={idx} className="rounded-lg bg-white shadow-sm px-4 py-3 flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">Degree Title</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full md:w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Degree Title"
                    value={edu.degree_title}
                    onChange={(e) => handleEduChange(idx, "degree_title", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">Institution</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-full md:w-1/2 focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEduChange(idx, "institution", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">Passing Year</label>
                  <input
                    className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-blue-200 text-sm"
                    placeholder="Passing Year"
                    type="number"
                    value={edu.passing_year}
                    onChange={(e) => handleEduChange(idx, "passing_year", e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">Upload Certificate</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFileChange(idx, e.target.files[0])}
                    className="file:mr-1 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 text-sm"
                  />
                </div>
                {edu.certificate_url && (
                  <a
                    download={edu.certificate}
                    href={`${IMAGE_URL}${edu.certificate_url}`}
                    alt="Certificate"
                    className="text-blue-600 underline font-medium text-sm"
                  >
                    View Certificate
                  </a>
                )}</div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 font-medium ml-2 px-2 py-1 rounded-md bg-red-50 text-sm"
                  onClick={() => removeEducation(idx)}
                >
                  Remove
                </button>
              
            </div>
          ))}
        </div>
        <button
          type="button"
          className="text-blue-700 font-medium mt-6 mb-3 px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 transition text-sm"
          onClick={addEducation}
        >
          + Add Education
        </button>
        <div className="mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Education"}
          </button>
        </div>
      </form>
    </div>
  );
}