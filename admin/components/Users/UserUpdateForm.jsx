import React, { useState } from "react";

const UserUpdateForm = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...user });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <input
        type="text"
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-2 rounded"
      />
      {/* Add more fields as needed */}
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default UserUpdateForm;
