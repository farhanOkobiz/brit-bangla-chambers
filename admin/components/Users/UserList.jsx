import React from "react";

const UserList = ({ users, onSelect, onDelete, onVerify, onStatusChange }) => (
  <table className="w-full border mt-4">
    <thead>
      <tr className="bg-gray-200 text-left">
        <th className="p-2">Name</th>
        <th className="p-2">Email</th>
        <th className="p-2">Role</th>
        <th className="p-2">Status</th>
        <th className="p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map((user) => (
        <tr key={user._id} className="border-b">
          <td className="p-2">{user.full_name}</td>
          <td className="p-2">{user.email}</td>
          <td className="p-2">{user.role}</td>
          <td className="p-2">{user.status || "-"}</td>
          <td className="p-2 flex gap-2">
            <button onClick={() => onSelect(user)} className="text-blue-600">View</button>
            <button onClick={() => onStatusChange(user)} className="text-yellow-600">Change Status</button>
            <button onClick={() => onDelete(user)} className="text-red-600">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default UserList;
