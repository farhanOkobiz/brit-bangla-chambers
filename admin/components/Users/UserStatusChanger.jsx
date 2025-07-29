import React from "react";

const UserStatusChanger = ({ user, onChangeStatus }) => (
  <div className="flex gap-2 items-center">
    <span>Status: <strong>{user.status || "-"}</strong></span>
    <select
      value={user.status || "inactive"}
      onChange={(e) => onChangeStatus(user, e.target.value)}
      className="border p-1 rounded"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="banned">Banned</option>
    </select>
  </div>
);

export default UserStatusChanger;
