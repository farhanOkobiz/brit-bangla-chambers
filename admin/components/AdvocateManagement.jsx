"use client";

import { useState, useEffect } from "react";
import { useAxios } from "../services/useAxios";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
} from "react-icons/fa";

const AdvocateManagement = () => {
  const useAxiosHook = useAxios;
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    needs_more_info: "bg-orange-100 text-orange-800",
  };

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.search) queryParams.append("search", filters.search);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", "10");

      const res = await useAxiosHook(`/advocate/all?${queryParams}`, {
        method: "GET",
      });

      if (res.ok) {
        setAdvocates(res.data.advocates || []);
        setPagination(res.data.pagination || {});
      }
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, [filters]);

  const handleStatusUpdate = async (
    advocateId,
    status,
    rejectedReason = "",
    adminNote = ""
  ) => {
    try {
      setActionLoading(true);
      const res = await useAxiosHook(`/advocate/verify/${advocateId}`, {
        method: "PUT",
        data: {
          status,
          rejected_reason: rejectedReason,
          admin_note: adminNote,
        },
      });

      if (res.ok) {
        alert(`Advocate ${status} successfully!`);
        fetchAdvocates();
        setShowModal(false);
      } else {
        alert(res.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (advocateId) => {
    try {
      setActionLoading(true);
      const res = await useAxiosHook(`/advocate/toggle-status/${advocateId}`, {
        method: "PUT",
      });

      if (res.ok) {
        alert("Advocate status updated successfully!");
        fetchAdvocates();
      } else {
        alert(res.data?.message || "Failed to toggle status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to toggle status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (advocateId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this advocate profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await useAxiosHook(`/advocate/delete/${advocateId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Advocate profile deleted successfully!");
        fetchAdvocates();
      } else {
        alert(res.data?.message || "Failed to delete advocate");
      }
    } catch (error) {
      console.error("Error deleting advocate:", error);
      alert("Failed to delete advocate");
    } finally {
      setActionLoading(false);
    }
  };

  const openAdvocateModal = async (advocateId) => {
    try {
      const res = await useAxiosHook(`/advocate/profile/${advocateId}`, {
        method: "GET",
      });

      if (res.ok) {
        setSelectedAdvocate(res.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching advocate details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Advocate Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage advocate registrations and verifications
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search advocates..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value, page: 1 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="needs_more_info">Needs More Info</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advocates List */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : advocates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No advocates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Advocate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bar Council No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {advocates.map((advocate) => (
                    <tr key={advocate._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {advocate.profile_photo ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:5000${advocate.profile_photo}`}
                                alt={advocate.user_id?.full_name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {advocate.user_id?.full_name?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {advocate.user_id?.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {advocate.designation}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {advocate.bar_council_enroll_num}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {advocate.experience_years} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[advocate.verification_status]
                          }`}
                        >
                          {advocate.verification_status
                            .replace("_", " ")
                            .toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(advocate.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openAdvocateModal(advocate._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye className="h-4 w-4" />
                          </button>

                          {advocate.verification_status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(advocate._id, "verified")
                                }
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                                disabled={actionLoading}
                              >
                                <FaCheck className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    advocate._id,
                                    "rejected",
                                    "Application rejected"
                                  )
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                                disabled={actionLoading}
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleToggleStatus(advocate._id)}
                            className={`${
                              advocate.is_active
                                ? "text-green-600 hover:text-green-900"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                            title={
                              advocate.is_active ? "Deactivate" : "Activate"
                            }
                            disabled={actionLoading}
                          >
                            {advocate.is_active ? (
                              <FaToggleOn className="h-4 w-4" />
                            ) : (
                              <FaToggleOff className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(advocate._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            disabled={actionLoading}
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={filters.page >= pagination.total}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page{" "}
                    <span className="font-medium">{filters.page}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span> (
                    {pagination.count} total advocates)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page - 1 })
                      }
                      disabled={filters.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page + 1 })
                      }
                      disabled={filters.page >= pagination.total}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advocate Details Modal */}
      {showModal && selectedAdvocate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Advocate Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Personal Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedAdvocate.user_id?.full_name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedAdvocate.user_id?.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedAdvocate.user_id?.phone}
                      </p>
                      <p>
                        <span className="font-medium">Designation:</span>{" "}
                        {selectedAdvocate.designation}
                      </p>
                      <p>
                        <span className="font-medium">Bar Council No:</span>{" "}
                        {selectedAdvocate.bar_council_enroll_num}
                      </p>
                      <p>
                        <span className="font-medium">Experience:</span>{" "}
                        {selectedAdvocate.experience_years} years
                      </p>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Address Information
                    </h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Present Address:</span>{" "}
                        {selectedAdvocate.present_address}
                      </p>
                      <p>
                        <span className="font-medium">Permanent Address:</span>{" "}
                        {selectedAdvocate.permanent_address}
                      </p>
                      {selectedAdvocate.office_address && (
                        <p>
                          <span className="font-medium">Office Address:</span>{" "}
                          {selectedAdvocate.office_address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Practice Areas */}
                  <div className="md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Practice Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAdvocate.practice_areas?.map((area, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="md:col-span-2">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Documents
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedAdvocate.documents?.nid_front && (
                        <div>
                          <p className="text-sm font-medium mb-1">NID Front</p>
                          <img
                            src={`http://localhost:5000${selectedAdvocate.documents.nid_front}`}
                            alt="NID Front"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      {selectedAdvocate.documents?.nid_back && (
                        <div>
                          <p className="text-sm font-medium mb-1">NID Back</p>
                          <img
                            src={`http://localhost:5000${selectedAdvocate.documents.nid_back}`}
                            alt="NID Back"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      {selectedAdvocate.documents?.bar_certificate && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Bar Certificate
                          </p>
                          <img
                            src={`http://localhost:5000${selectedAdvocate.documents.bar_certificate}`}
                            alt="Bar Certificate"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                      {selectedAdvocate.documents?.profile_photo_with_gown && (
                        <div>
                          <p className="text-sm font-medium mb-1">
                            Photo with Gown
                          </p>
                          <img
                            src={`http://localhost:5000${selectedAdvocate.documents.profile_photo_with_gown}`}
                            alt="Photo with Gown"
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedAdvocate.verification_status === "pending" && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedAdvocate._id,
                        "rejected",
                        "Application rejected after review"
                      )
                    }
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        selectedAdvocate._id,
                        "verified",
                        "",
                        "Application approved after review"
                      )
                    }
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvocateManagement;
