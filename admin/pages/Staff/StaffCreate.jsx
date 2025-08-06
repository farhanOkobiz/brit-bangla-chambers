import React, { useState } from 'react';
import { UseAxios } from '../../services/UseAxios';
import { toast } from 'react-toastify';

function StaffCreate() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    nidNumber: '',
    permanentAddress: '',
    presentAddress: '',
    phone: '',
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
      fullName: '',
      email: '',
      password: '',
      nidNumber: '',
      permanentAddress: '',
      presentAddress: '',
      phone: '',
    });
  } else {
    toast.error("Failed to create staff: " + (res.data?.message || "Unknown error"));
  }
};


  return (
    <div className=" mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
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
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded"
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
            className="w-full border px-4 py-2 rounded"
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
            className="w-full border px-4 py-2 rounded"
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
            className="w-full border px-4 py-2 rounded"
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
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Create Staff
        </button>
      </form>
    </div>
  );
}

export default StaffCreate;
