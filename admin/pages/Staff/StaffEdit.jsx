import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UseAxios } from "../../services/UseAxios";
import { toast } from "react-toastify";

function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const imageUrl = import.meta.env.VITE_API_IMAGE_URL;

  // Initialize state for all fields + image + preview
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "", // optional to change
    nidNumber: "",
    permanentAddress: "",
    presentAddress: "",
    phone: "",
    education: [{ degree: "", passingYear: "" }], // array of objects
    designation: "",
    department: "",
    joiningDate: "",
    dutyShift: "",
    salaryStructure: "",
    jobResponsibilities: "",
    role: "staff",
    image: "", // <-- new field for image filename or URL
  });

  const [preview, setPreview] = useState(null); // preview image url
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch staff data on mount
  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      const res = await UseAxios(`/staff/${id}`);
      if (res.ok) {
        const staff = res.data.staff;

        setFormData({
          fullName: staff.fullName || "",
          email: staff.email || "",
          password: "",
          nidNumber: staff.nidNumber || "",
          permanentAddress: staff.permanentAddress || "",
          presentAddress: staff.presentAddress || "",
          phone: staff.phone || "",
          education:
            staff.education.length > 0
              ? staff.education
              : [{ degree: "", passingYear: "" }],
          designation: staff.designation || "",
          department: staff.department || "",
          joiningDate: staff.joiningDate ? staff.joiningDate.split("T")[0] : "", // format date yyyy-mm-dd
          dutyShift: staff.dutyShift || "",
          salaryStructure: staff.salaryStructure || "",
          jobResponsibilities: staff.jobResponsibilities || "",
          role: staff.role || "staff",
          image: staff.image || "", // set existing image if any
        });

        // Set preview if image url exists
        if (staff.image) setPreview(staff.image);
      } else {
        setError("Failed to load staff data");
      }
      setLoading(false);
    }
    fetchStaff();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle education inputs separately because it's an array
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      education: newEducation,
    }));
  };

  // Add new education field
  const addEducationField = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", passingYear: "" }],
    }));
  };

  // Remove education field
  const removeEducationField = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      education:
        newEducation.length > 0
          ? newEducation
          : [{ degree: "", passingYear: "" }],
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      // Prepare form data for sending, including image file if updated
      const formPayload = new FormData();

      // Append all form fields except image first
      for (const key in formData) {
        if (key === "education") {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else if (key !== "image") {
          formPayload.append(key, formData[key]);
        }
      }

      

      // Append image if it's a File (newly selected)
      if (formData.image && formData.image instanceof File) {
        formPayload.append("image", formData.image);
      }

      // For password: if empty, don't send (optional)
      if (!formData.password) {
        formPayload.delete("password"); // ensure not sent if empty
      }



      // UseAxios should be able to send FormData
      const res = await UseAxios(`/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formPayload,
      });

      setSubmitLoading(false);

      if (res.ok) {
        toast.success("Staff updated successfully");
        navigate("/admin/staff/manage");
      } else {
        toast.error(res.data?.message || "Failed to update staff");
        setError(res.data?.message || "Failed to update staff");
      }
    } catch  {
      setSubmitLoading(false);
      toast.error("Something went wrong");
      setError("Something went wrong");
    }
  };

  if (loading) return <p>Loading staff data...</p>;

  return (
    <div className="p-6 bg-white rounded shadow py-4 md:py-8 lg:py-16">
      <h2 className="text-xl font-semibold mb-4">Edit Staff</h2>
      {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Grid wrapper for most fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center ">
            <label className="block font-medium mb-1">Profile Image</label>
            {preview ? (
              <img
                src={`${imageUrl}${preview}`}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-full mb-2 border border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block cursor-pointer"
            />
          </div>

          {/* Other fields */}
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 focus:outline-none  px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 focus:outline-none px-4 py-2 rounded"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block font-medium">
              Password (leave blank to keep unchanged)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-blue-200 focus:outline-none px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">NID Number</label>
            <input
              type="text"
              name="nidNumber"
              value={formData.nidNumber}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 focus:outline-none px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Permanent Address</label>
            <input
              type="text"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 focus:outline-none px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Present Address</label>
            <input
              type="text"
              name="presentAddress"
              value={formData.presentAddress}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 focus:outline-none px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-blue-200 focus:outline-none px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Duty Shift</label>
            <input
              type="text"
              name="dutyShift"
              value={formData.dutyShift}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Salary Structure</label>
            <input
              type="text"
              name="salaryStructure"
              value={formData.salaryStructure}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Education section (outside grid to span full width) */}
          <div>
            <label className="block font-medium mb-2">Education</label>
            {formData.education.map((edu, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2"
              >
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(idx, "degree", e.target.value)
                  }
                  className="flex-1 border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Passing Year"
                  value={edu.passingYear}
                  onChange={(e) =>
                    handleEducationChange(idx, "passingYear", e.target.value)
                  }
                  className="w-32 border px-3 py-2 rounded"
                />
                <button
                  type="button"
                  onClick={() => removeEducationField(idx)}
                  className="text-red-600 px-2"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducationField}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              + Add Education
            </button>
          </div>
          <div>
            <label className="block font-medium">Job Responsibilities</label>
            <textarea
              name="jobResponsibilities"
              value={formData.jobResponsibilities}
              onChange={handleChange}
              rows={3}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            {submitLoading ? "Updating..." : "Update Staff"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StaffEdit;
