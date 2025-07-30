"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
import { useAxios } from "../services/UseAxios";
=======
import { UseAxios } from "../services/UseAxios";
>>>>>>> development
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaGavel,
  FaClock,
  FaStar,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const AdvocateManagement = () => {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

  const UseAxiosHook = UseAxios;

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const res = await UseAxiosHook("/advocate/all", {
        method: "GET",
      });

      if (res.ok) {
        setAdvocates(res.data || []);
      } else {
        console.error("Failed to fetch advocates:", res.data);
      }
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (advocateId, newStatus) => {
    try {
      const res = await UseAxiosHook(`/advocate/update/${advocateId}`, {
        method: "PUT",
        data: { status: newStatus },
      });

      if (res.ok) {
        alert(`Advocate status updated to ${newStatus}`);
        fetchAdvocates();
        if (selectedAdvocate && selectedAdvocate._id === advocateId) {
          setSelectedAdvocate({ ...selectedAdvocate, status: newStatus });
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleViewDetails = (advocate) => {
    setSelectedAdvocate(advocate);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAdvocates = advocates.filter((advocate) => {
    if (filter === "all") return true;
    return advocate.status === filter;
  });

  useEffect(() => {
    fetchAdvocates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile spacing for fixed header */}
      <div className="pt-16 lg:pt-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Advocate Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage advocate profiles and approvals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total Advocates: {advocates.length}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-green-100 rounded-lg">
                    <FaUser className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Approved
                    </p>
                    <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {advocates.filter((a) => a.status === "approved").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-yellow-100 rounded-lg">
                    <FaClock className="h-5 w-5 lg:h-6 lg:w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {advocates.filter((a) => a.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-red-100 rounded-lg">
                    <FaGavel className="h-5 w-5 lg:h-6 lg:w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Rejected
                    </p>
                    <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {advocates.filter((a) => a.status === "rejected").length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-purple-100 rounded-lg">
                    <FaStar className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Featured
                    </p>
                    <p className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {advocates.filter((a) => a.featured).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  {[
                    {
                      key: "all",
                      label: "All Advocates",
                      count: advocates.length,
                    },
                    {
                      key: "pending",
                      label: "Pending",
                      count: advocates.filter((a) => a.status === "pending")
                        .length,
                    },
                    {
                      key: "approved",
                      label: "Approved",
                      count: advocates.filter((a) => a.status === "approved")
                        .length,
                    },
                    {
                      key: "rejected",
                      label: "Rejected",
                      count: advocates.filter((a) => a.status === "rejected")
                        .length,
                    },
                  ].map((tab) => (
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

            {/* Advocates Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Advocate
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAdvocates.map((advocate) => (
                      <tr key={advocate._id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {advocate.profile_photo_url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={
                                    advocate.profile_photo_url ||
                                    "/placeholder.svg"
                                  }
                                  alt={advocate.user_id?.full_name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <FaUser className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {advocate.user_id?.full_name || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {advocate.designation || "Advocate"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FaEnvelope className="h-4 w-4 mr-2 text-gray-400" />
                            {advocate.user_id?.email || "No email"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaPhone className="h-4 w-4 mr-2 text-gray-400" />
                            {advocate.user_id?.phone || "No phone"}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {advocate.experience_years || 0} years
                          </div>
                          <div className="text-sm text-gray-500">
                            {advocate.bar_council_enroll_num || "No enrollment"}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              advocate.status
                            )}`}
                          >
                            {advocate.status?.charAt(0).toUpperCase() +
                              advocate.status?.slice(1)}
                          </span>
                          {advocate.featured && (
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(advocate)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4" />
                            </button>
                            {advocate.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(advocate._id, "approved")
                                  }
                                  className="text-green-600 hover:text-green-900 p-1"
                                  title="Approve"
                                >
                                  <FaCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(advocate._id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Reject"
                                >
                                  <FaTimes className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAdvocates.length === 0 && (
                <div className="text-center py-12">
                  <FaUser className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No advocates found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === "all"
                      ? "No advocates have been created yet."
                      : `No ${filter} advocates found.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedAdvocate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Advocate Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {selectedAdvocate.profile_photo_url ? (
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src={
                        selectedAdvocate.profile_photo_url || "/placeholder.svg"
                      }
                      alt={selectedAdvocate.user_id?.full_name}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <FaUser className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedAdvocate.user_id?.full_name}
                    </h4>
                    <p className="text-gray-600">
                      {selectedAdvocate.designation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Contact Information
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedAdvocate.user_id?.email}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedAdvocate.user_id?.phone}
                      </p>
                      <p>
                        <strong>Office:</strong>{" "}
                        {selectedAdvocate.office_address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Professional Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Experience:</strong>{" "}
                        {selectedAdvocate.experience_years} years
                      </p>
                      <p>
                        <strong>Bar Council:</strong>{" "}
                        {selectedAdvocate.bar_council_enroll_num ||
                          "Not provided"}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedAdvocate.status}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedAdvocate.bio && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Biography
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedAdvocate.bio}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  {selectedAdvocate.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedAdvocate._id, "approved");
                          setShowDetails(false);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedAdvocate._id, "rejected");
                          setShowDetails(false);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvocateManagement;
