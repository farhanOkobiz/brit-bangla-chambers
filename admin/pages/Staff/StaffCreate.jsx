import React, { useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { toast } from "react-toastify";

function StaffCreate() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    nidNumber: "",
    permanentAddress: "",
    presentAddress: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await UseAxios("/staff", {
      method: "POST",
      data: formData,
    });

    if (res.ok) {
      toast.success("Staff created successfully!");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        nidNumber: "",
        permanentAddress: "",
        presentAddress: "",
        phone: "",
      });
    } else {
      toast.error(
        "Failed to create staff: " + (res.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-6 sm:p-8 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create New Staff
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Field Template */}
        {[
          { name: "fullName", label: "Full Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
          { name: "nidNumber", label: "NID Number", type: "text" },
          {
            name: "permanentAddress",
            label: "Permanent Address",
            type: "text",
          },
          { name: "presentAddress", label: "Present Address", type: "text" },
          { name: "phone", label: "Phone", type: "tel" },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all"
        >
          Create Staff
        </button>
      </form>
    </div>
  );
}

export default StaffCreate;
