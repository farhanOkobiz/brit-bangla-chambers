import React from "react";

const UserDetails = ({ user, onClose, onUpdate }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <p><strong>Name:</strong> {user.full_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.status || "-"}</p>
      {/* Add more fields as needed */}
      <div className="mt-4 flex gap-2">
        <button onClick={onUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
);

export default UserDetails;
