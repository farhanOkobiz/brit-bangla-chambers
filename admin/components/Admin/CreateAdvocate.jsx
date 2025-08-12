import { useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../auth/AuthContext";

export default function CreateAdvocate() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    designation: "",
    bar_council_enroll_num: "",
    experience_years: "",
    office_address: "",
    bio: "",
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = UseAuth()
  const base = role === "admin" ? "/admin" : "/staff";

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? e.target.files[0] : value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Required fields validation
    if (!form.full_name.trim()) errors.push("Full name is required");
    if (!form.email.trim()) errors.push("Email is required");
    if (!form.phone.trim()) errors.push("Phone is required");
    if (!form.password.trim()) errors.push("Password is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      errors.push("Please enter a valid email address");
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      errors.push("Please enter a valid phone number");
    }
    
    // Password validation
    if (form.password && form.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    
    // Experience years validation
    if (form.experience_years && (isNaN(form.experience_years) || form.experience_years < 0)) {
      errors.push("Experience years must be a valid positive number");
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "profilePhoto" && value) {
          formData.append("profilePhoto", value);
        } else {
          formData.append(key, value);
        }
      });

      const res = await UseAxios("/advocate/create", {
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.ok) {
        setSuccess("Advocate created successfully!");
        setForm({
          full_name: "",
          email: "",
          phone: "",
          password: "",
          designation: "",
          bar_council_enroll_num: "",
          experience_years: "",
          office_address: "",
          bio: "",
          profilePhoto: null,
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate(`${base}/advocates`);
        }, 2000);
      } else {
        setError(res.data?.message || "Failed to create advocate.");
      }
    } catch (err) {
      console.error("Error creating advocate:", err);
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Advocate Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bar Council Enroll Number
              </label>
              <input
                name="bar_council_enroll_num"
                value={form.bar_council_enroll_num}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Years
              </label>
              <input
                name="experience_years"
                type="number"
                min="0"
                value={form.experience_years}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <input
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Address
              </label>
              <input
                name="office_address"
                value={form.office_address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Creating Advocate...</span>
                </div>
              ) : (
                "Create Advocate"
              )}
            </button>
          </div>
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-center font-medium">
                {success}
              </p>
              <p className="text-green-600 text-center text-sm mt-1">
                Redirecting to advocate list...
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-center font-medium">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}