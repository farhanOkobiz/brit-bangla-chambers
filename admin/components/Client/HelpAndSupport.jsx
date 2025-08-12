import React, { useEffect, useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { CheckCircle, Trash2, Clock, HelpCircle, User } from "lucide-react";
import { UseAuth } from "../../auth/AuthContext";

const HelpAndSupport = () => {
    const [data, setData] = useState([]);
    const { role } = UseAuth()
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending");
    const [expandedRequestId, setExpandedRequestId] = useState(null);


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await UseAxios("/support", { method: "GET" });
      setData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching help and support data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeStatus = async (id) => {
    try {
      await UseAxios(`/support/${id}/status`, {
        method: "PUT",
        data: { status: "resolved" },
      });
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await UseAxios(`/support/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  const pendingRequests = data.filter((r) => r.status === "pending");
  const resolvedRequests = data.filter((r) => r.status === "resolved");

  if (loading) {
    return (
        <div className="max-w-8xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-gray-600 mb-6">Manage user support requests efficiently.</p>

            {pendingRequests.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-3 text-yellow-600">Pending Help Requests</h2>
                    <div className="space-y-4">
                        {pendingRequests.map((req) => (
                            <div key={req._id} className="bg-white border border-yellow-300 rounded-lg p-5 shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{req.subject}</h3>
                                    <span className="flex items-center gap-1 text-sm text-yellow-600 font-medium bg-yellow-100 px-2 py-0.5 rounded">
                                        <Clock size={14} />
                                        Pending
                                    </span>
                                </div>
                                <p className="text-gray-700">{req.message}</p>
                                <p className="text-sm text-gray-500 mt-2">From: {req.userId?.full_name || "Unknown"}</p>
                                <button
                                    onClick={() => handleChangeStatus(req._id)}
                                    className="mt-4 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                                >
                                    <CheckCircle size={16} className="mr-2" />
                                    Mark as Resolved
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resolvedRequests.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-3 text-green-600">Resolved Requests</h2>
                    <div className="space-y-4">
                        {resolvedRequests.map((req) => (
                            <div key={req._id} className="bg-gray-50 border border-gray-300 rounded-lg p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{req.subject}</h3>
                                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded">
                                        <CheckCircle size={14} />
                                        Resolved
                                    </span>
                                </div>
                                <p className="text-gray-700">{req.message}</p>
                                <p className="text-sm text-gray-500 mt-2">From: {req.userId?.full_name || "Unknown"}</p>
                                { role === "admin" && (
                                <button
                                    onClick={() => handleDelete(req._id)}
                                    className="mt-4 inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </button>
                                )}
                           
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pendingRequests.length === 0 && resolvedRequests.length === 0 && (
                <div className="text-center text-gray-500 mt-10">No support requests found.</div>
            )}
        </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <HelpCircle className="text-blue-600" size={28} />
              Help & Support
            </h1>
            <p className="text-gray-600 mt-2">
              Manage user support requests efficiently
            </p>
          </div>

          <div className="flex items-center mt-4 sm:mt-0">
            <div className="bg-blue-50 rounded-lg p-3 mr-4">
              <div className="text-blue-800 font-bold text-xl">
                {pendingRequests.length}
              </div>
              <div className="text-blue-600 text-sm">Pending</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-green-800 font-bold text-xl">
                {resolvedRequests.length}
              </div>
              <div className="text-green-600 text-sm">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-1 ${
            activeTab === "pending"
              ? "bg-white text-blue-600 border border-b-0 border-gray-200"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          <div className="flex items-center">
            <Clock className="mr-2" size={16} />
            Pending Requests
            {pendingRequests.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === "resolved"
              ? "bg-white text-green-600 border border-b-0 border-gray-200"
              : "text-gray-600 hover:text-green-600"
          }`}
          onClick={() => setActiveTab("resolved")}
        >
          <div className="flex items-center">
            <CheckCircle className="mr-2" size={16} />
            Resolved Requests
            {resolvedRequests.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {resolvedRequests.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeTab === "pending" && (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <HelpCircle className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No pending requests
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    All support requests are resolved. Great job!
                  </p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex justify-between items-start p-4 cursor-pointer"
                      onClick={() => toggleExpand(req._id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate mr-2">
                            {req.subject}
                          </h3>
                          <span className="flex items-center gap-1 text-xs text-yellow-700 font-medium bg-yellow-100 px-2 py-1 rounded">
                            <Clock size={14} />
                            Pending
                          </span>
                        </div>
                        <p className="text-gray-600 truncate text-sm">
                          {req.message.substring(0, 100)}
                          {req.message.length > 100 ? "..." : ""}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        {expandedRequestId === req._id ? (
                          <ChevronUp className="text-gray-500" />
                        ) : (
                          <ChevronDown className="text-gray-500" />
                        )}
                      </div>
                    </div>

                    {expandedRequestId === req._id && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <User className="mr-2" size={14} />
                            <span className="font-medium text-gray-700">
                              {req.userId?.full_name || "Unknown User"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Mail className="mr-2" size={14} />
                            <span className="font-medium text-gray-700">
                              {req.userId?.email || "No email"}
                            </span>
                          </div>
                          {req.userId?.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="mr-2" size={14} />
                              <span className="font-medium text-gray-700">
                                {req.userId.phone}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-700 mb-4 whitespace-pre-line">
                          {req.message}
                        </p>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleChangeStatus(req._id)}
                            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Mark as Resolved
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "resolved" && (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resolvedRequests.length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <CheckCircle className="text-green-400" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No resolved requests
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Resolved requests will appear here once marked as completed.
                  </p>
                </div>
              ) : (
                resolvedRequests.map((req) => (
                  <div
                    key={req._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {req.subject}
                          </h3>
                          <p className="text-gray-600 text-sm truncate">
                            {req.message.substring(0, 80)}
                            {req.message.length > 80 ? "..." : ""}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-green-700 font-medium bg-green-100 px-2 py-1 rounded ml-2">
                          <CheckCircle size={14} />
                          Resolved
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <User className="mr-2" size={14} />
                          <span className="font-medium text-gray-700">
                            {req.userId?.full_name || "Unknown User"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 flex justify-end">
                      <button
                        onClick={() => handleDelete(req._id)}
                        className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                      >
                        <Trash2 size={16} className="mr-1.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Empty state for both tabs */}
      {pendingRequests.length === 0 && resolvedRequests.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="mx-auto bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mb-6">
            <HelpCircle className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No support requests
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Your support inbox is empty. All new requests will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default HelpAndSupport;
