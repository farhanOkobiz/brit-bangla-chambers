import React from "react";

const UserDeleteButton = ({ user, onDelete }) => (
  <button
    onClick={() => onDelete(user)}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Delete
  </button>
);

export default UserDeleteButton;
