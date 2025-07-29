"use client";

import { useState, useEffect } from "react";
import UseAxios from "../services/UseAxios";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaGavel,
  FaTimes,
  FaBan,
  FaUserCheck,
} from "react-icons/fa";

const UserManagement = () => {
  const [userType, setUserType] = useState("client"); // client or advocate
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [filter, setFilter] = useState("all"); // all, active, inactive, banned, pending, approved, rejected
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setError(null);

      // Make sure to provide a valid URL
      const endpoint = userType === "client" ? "/client/all" : "/advocate/all";
      const response = await UseAxios(endpoint, {
        method: "GET",
      });

      if (response.ok) {
        setUsers(response.data || []);
      } else {
        setError(response.data?.message || `Failed to fetch ${userType}s`);
      }
    } catch (err) {
      console.error(`Error fetching ${userType}s:`, err);
      setError(`An error occurred while fetching ${userType}s`);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "banned":
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFilteredUsers = () => {
    if (filter === "all") return users;
    return users.filter((user) => {
      if (userType === "client") {
        return user.status === filter;
      } else {
        return user.status === filter;
      }
    });
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
    setLoading(true);
    fetchUsers();
  }, [userType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button
          onClick={fetchUsers}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              {getFilterTabs().map((tab) => (
                <div
                  key={tab.key}
                  className="bg-white rounded-lg shadow p-4 lg:p-6"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 lg:p-3 rounded-lg ${
                        tab.key === "all"
                          ? "bg-blue-100"
                          : tab.key === "active" || tab.key === "approved"
                          ? "bg-green-100"
                          : tab.key === "inactive" || tab.key === "pending"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {tab.key === "all" && (
                        <FaUser className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                      )}
                      {(tab.key === "active" || tab.key === "approved") && (
                        <FaUserCheck className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                      )}
                      {(tab.key === "inactive" || tab.key === "pending") && (
                        <FaUser className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />
                      )}
                      {(tab.key === "banned" || tab.key === "rejected") && (
                        <FaBan className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {tab.label}
                      </p>
                      <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                        {tab.count}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav
                  className="-mb-px flex space-x-8 px-6 overflow-x-auto"
                  aria-label="Tabs"
                >
                  {getFilterTabs().map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`${
                        filter === tab.key
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      {userType === "advocate" && (
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Professional
                        </th>
                      )}
                      {userType === "client" && (
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                      )}
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No {userType}s found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.profile_photo ||
                                user.profile_photo_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={
                                      user.profile_photo ||
                                      user.profile_photo_url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={user.user_id?.full_name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <FaUser className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.user_id?.full_name || "Unknown"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {userType === "advocate"
                                    ? user.designation || "Advocate"
                                    : "Client"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <FaEnvelope className="h-4 w-4 mr-2 text-gray-400" />
                              {user.user_id?.email || "No email"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <FaPhone className="h-4 w-4 mr-2 text-gray-400" />
                              {user.user_id?.phone || "No phone"}
                            </div>
                          </td>
                          {userType === "advocate" && (
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.experience_years || 0} years exp.
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.bar_council_enroll_num || "No enrollment"}
                              </div>
                            </td>
                          )}
                          {userType === "client" && (
                            <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.nid_number || "No NID"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.gender || "Not specified"}
                              </div>
                            </td>
                          )}
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                user.status
                              )}`}
                            >
                              {user.status?.charAt(0).toUpperCase() +
                                user.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Details"
                              >
                                <FaEye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowUpdateForm(true);
                                }}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Edit"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
          getStatusColor={getStatusColor}
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

// User Details Modal Component
const UserDetailsModal = ({
  user,
  userType,
  onClose,
  onStatusUpdate,
  getStatusOptions,
  getStatusColor,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Photo and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                {user.profile_photo || user.profile_photo_url ? (
                  <img
                    className="h-20 w-20 rounded-full object-cover"
                    src={
                      user.profile_photo ||
                      user.profile_photo_url ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={user.user_id?.full_name}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                    <FaUser className="h-10 w-10 text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {user.user_id?.full_name}
                </h4>
                <p className="text-gray-600">
                  {userType === "advocate"
                    ? user.designation || "Advocate"
                    : "Client"}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status?.charAt(0).toUpperCase() +
                      user.status?.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <FaEnvelope className="h-4 w-4 mr-2" />
                Contact Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Email:</strong>{" "}
                  {user.user_id?.email || "Not provided"}
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
                  {user.user_id?.phone || "Not provided"}
                </div>
              </div>
            </div>

            {/* Client-specific details */}
            {userType === "client" && (
              <>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FaIdCard className="h-4 w-4 mr-2" />
                    Personal Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>NID Number:</strong>{" "}
                      {user.nid_number || "Not provided"}
                    </div>
                    <div>
                      <strong>Date of Birth:</strong>{" "}
                      {user.date_of_birth || "Not provided"}
                    </div>
                    <div>
                      <strong>Gender:</strong> {user.gender || "Not specified"}
                    </div>
                    <div>
                      <strong>Preferred Language:</strong>{" "}
                      {user.preferred_language || "Not specified"}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                    Address Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Present Address:</strong>
                      <p className="mt-1 text-gray-600">
                        {user.present_address || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <strong>Permanent Address:</strong>
                      <p className="mt-1 text-gray-600">
                        {user.permanent_address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Advocate-specific details */}
            {userType === "advocate" && (
              <>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FaGavel className="h-4 w-4 mr-2" />
                    Professional Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Experience:</strong> {user.experience_years || 0}{" "}
                      years
                    </div>
                    <div>
                      <strong>Bar Council Enrollment:</strong>{" "}
                      {user.bar_council_enroll_num || "Not provided"}
                    </div>
                    <div>
                      <strong>Consultation Available:</strong>{" "}
                      {user.consultation_available ? "Yes" : "No"}
                    </div>
                    <div>
                      <strong>Featured:</strong> {user.featured ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {user.bio && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      Biography
                    </h5>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                  </div>
                )}

                {user.office_address && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                      Office Address
                    </h5>
                    <p className="text-sm text-gray-600">
                      {user.office_address}
                    </p>
                  </div>
                )}

                {user.contact && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      Additional Contact
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {user.contact.phone && (
                        <div>
                          <strong>Contact Phone:</strong> {user.contact.phone}
                        </div>
                      )}
                      {user.contact.facebook && (
                        <div>
                          <strong>Facebook:</strong>
                          <a
                            href={user.contact.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      {user.contact.linkedin && (
                        <div>
                          <strong>LinkedIn:</strong>
                          <a
                            href={user.contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Status Change Section */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Change Status</h5>
              <div className="flex flex-wrap gap-2">
                {getStatusOptions().map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusUpdate(user._id, status)}
                    disabled={user.status === status}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.status === status
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Update Modal Component
const UserUpdateModal = ({ user, userType, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: user.user_id?.full_name || "",
    phone: user.user_id?.phone || "",
    // Client fields
    nidNumber: user.nid_number || "",
    dateOfBirth: user.date_of_birth || "",
    gender: user.gender || "",
    presentAddress: user.present_address || "",
    permanentAddress: user.permanent_address || "",
    preferred_language: user.preferred_language || "",
    // Advocate fields
    designation: user.designation || "",
    bar_council_enroll_num: user.bar_council_enroll_num || "",
    experience_years: user.experience_years || "",
    bio: user.bio || "",
    office_address: user.office_address || "",
    consultation_available: user.consultation_available || false,
    featured: user.featured || false,
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });

      // Add profile photo if selected
      if (profilePhoto) {
        submitData.append("profilePhoto", profilePhoto);
      }

      await onUpdate(submitData);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Update {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Client-specific fields */}
            {userType === "client" && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      NID Number
                    </label>
                    <input
                      type="text"
                      name="nidNumber"
                      value={formData.nidNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Language
                    </label>
                    <input
                      type="text"
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Present Address
                    </label>
                    <textarea
                      name="presentAddress"
                      value={formData.presentAddress}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permanent Address
                    </label>
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Advocate-specific fields */}
            {userType === "advocate" && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Professional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bar Council Enrollment Number
                    </label>
                    <input
                      type="text"
                      name="bar_council_enroll_num"
                      value={formData.bar_council_enroll_num}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biography
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Office Address
                    </label>
                    <textarea
                      name="office_address"
                      value={formData.office_address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="consultation_available"
                      checked={formData.consultation_available}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Consultation Available
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Featured Advocate
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
