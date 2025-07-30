import React, { useEffect, useState } from "react";
import UserList from "../../components/Users/UserList";
import UserDetails from "../../components/Users/UserDetails";
import UserUpdateForm from "../../components/Users/UserUpdateForm";
import UserStatusChanger from "../../components/Users/UserStatusChanger";
//import UserVerifyButton from "../../components/Users/UserVerifyButton";
import UserDeleteButton from "../../components/Users/UserDeleteButton";
<<<<<<< HEAD
import { useAxios } from "../../services/UseAxios";
=======
import { UseAxios } from "../../services/UseAxios";
>>>>>>> development

const fetchUsers = async () => {
  const res = await UseAxios("/auth/users", { method: "GET" });
  return res.ok && res.data.users ? res.data.users : [];
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchUsers();
      setUsers(data);
    })();
  }, []);

  const handleSelect = (user) => setSelectedUser(user);
  const handleCloseDetails = () => setSelectedUser(null);
  const handleUpdate = () => setShowUpdateForm(true);
  const handleCancelUpdate = () => setShowUpdateForm(false);
  const handleSaveUpdate = async (updatedUser) => {
    // Update user data in backend
    const res = await UseAxios(`/client/update/${updatedUser._id}`, {
      method: "PUT",
      data: updatedUser,
    });
    if (res.ok && res.data.client) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === updatedUser._id
            ? { ...u, ...res.data.client.user_id, ...res.data.client }
            : u
        )
      );
      setShowUpdateForm(false);
      setSelectedUser({
        ...updatedUser,
        ...res.data.client.user_id,
        ...res.data.client,
      });
    }
  };
  const handleDelete = async (user) => {
    const res = await UseAxios(`/client/profile/${user._id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setSelectedUser(null);
    }
  };
  // Verification removed
  const handleStatusChange = async (user, status) => {
    const res = await UseAxios(`/client/update/${user._id}`, {
      method: "PUT",
      data: { status },
    });
    if (res.ok && res.data.client) {
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status } : u))
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <UserList
        users={users}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      {selectedUser && !showUpdateForm && (
        <UserDetails
          user={selectedUser}
          onClose={handleCloseDetails}
          onUpdate={handleUpdate}
        />
      )}
      {showUpdateForm && (
        <UserUpdateForm
          user={selectedUser}
          onSave={handleSaveUpdate}
          onCancel={handleCancelUpdate}
        />
      )}
    </div>
  );
};

export default Users;
