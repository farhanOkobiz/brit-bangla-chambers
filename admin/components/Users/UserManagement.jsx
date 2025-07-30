"use client";

import { useState, useEffect } from "react";
import { UseAxios } from "../../services/UseAxios";
import UserStats from "./UserStats";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import UserDetailsModal from "./UserDetailsModal";
import UserUpdateModal from "./UserUpdateModal";

const UserManagement = () => {
  const [userType, setUserType] = useState("client"); // client or advocate
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, inactive, banned, pending, approved, rejected

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = userType === "client" ? "/client/all" : "/advocate/all";
      const res = await UseAxios(endpoint, { method: "GET" });
      console.log(`Fetched ${userType}s:`, res.data);

      if (res.ok) {
        setUsers(res.data || []);
      } else {
        console.error(`Failed to fetch ${userType}s:`, res.data);
      }
    } catch (error) {
      console.error(`Error fetching ${userType}s:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const endpoint =
        userType === "client"
          ? `/client/update/${userId}`
          : `/advocate/update/${userId}`;

      const res = await UseAxios(endpoint, {
        method: "PUT",
        data: { status: newStatus },
      });

      if (res.ok) {
        alert(
          `${
            userType.charAt(0).toUpperCase() + userType.slice(1)
          } status updated to ${newStatus}`
        );
        fetchUsers();
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, status: newStatus });
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (userId) => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${userType}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const endpoint =
        userType === "client"
          ? `/client/profile/${userId}`
          : `/advocate/profile/${userId}`;

      const res = await UseAxios(endpoint, { method: "DELETE" });

      if (res.ok) {
        alert(
          `${
            userType.charAt(0).toUpperCase() + userType.slice(1)
          } deleted successfully`
        );
        fetchUsers();
        setShowDetails(false);
        setSelectedUser(null);
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleUpdateUser = async (formData) => {
    try {
      const endpoint =
        userType === "client"
          ? `/client/update/${selectedUser._id}`
          : `/advocate/update/${selectedUser._id}`;

      const res = await UseAxios(endpoint, {
        method: "PUT",
        data: formData,
      });

      if (res.ok) {
        alert(
          `${
            userType.charAt(0).toUpperCase() + userType.slice(1)
          } updated successfully`
        );
        setShowUpdateForm(false);
        fetchUsers();
        setSelectedUser(null);
        setShowDetails(false);
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const getFilteredUsers = () => {
    if (filter === "all") return users;
    return users.filter((user) => user.status === filter);
  };

  const getStatusOptions = () => {
    if (userType === "client") {
      return ["active", "inactive", "banned"];
    } else {
      return ["pending", "approved", "rejected"];
    }
  };

  const getFilterTabs = () => {
    const baseFilters = [
      { key: "all", label: "All Users", count: users.length },
    ];

    if (userType === "client") {
      return [
        ...baseFilters,
        {
          key: "active",
          label: "Active",
          count: users.filter((u) => u.status === "active").length,
        },
        {
          key: "inactive",
          label: "Inactive",
          count: users.filter((u) => u.status === "inactive").length,
        },
        {
          key: "banned",
          label: "Banned",
          count: users.filter((u) => u.status === "banned").length,
        },
      ];
    } else {
      return [
        ...baseFilters,
        {
          key: "pending",
          label: "Pending",
          count: users.filter((u) => u.status === "pending").length,
        },
        {
          key: "approved",
          label: "Approved",
          count: users.filter((u) => u.status === "approved").length,
        },
        {
          key: "rejected",
          label: "Rejected",
          count: users.filter((u) => u.status === "rejected").length,
        },
      ];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();
  const filterTabs = getFilterTabs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile spacing for fixed header */}
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage {userType}s and their profiles
              </p>
            </div>

            {/* User Type Selector */}
            <div className="flex items-center space-x-4">
              <select
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  setFilter("all");
                  setSelectedUser(null);
                  setShowDetails(false);
                  setShowUpdateForm(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="client">Clients</option>
                <option value="advocate">Advocates</option>
              </select>
              <div className="text-sm text-gray-500">Total: {users.length}</div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <UserStats filterTabs={filterTabs} />

            {/* Filter Tabs */}
            <UserFilters
              filterTabs={filterTabs}
              filter={filter}
              setFilter={setFilter}
            />

            {/* Users Table */}
            <UserTable
              users={filteredUsers}
              userType={userType}
              onViewDetails={handleViewDetails}
              onEdit={(user) => {
                setSelectedUser(user);
                setShowUpdateForm(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          userType={userType}
          onClose={() => setShowDetails(false)}
          onStatusUpdate={handleStatusUpdate}
          getStatusOptions={getStatusOptions}
        />
      )}

      {/* Update Form Modal */}
      {showUpdateForm && selectedUser && (
        <UserUpdateModal
          user={selectedUser}
          userType={userType}
          onClose={() => setShowUpdateForm(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
