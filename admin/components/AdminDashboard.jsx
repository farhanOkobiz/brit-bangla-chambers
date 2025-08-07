import React, { useEffect, useState } from "react";
import { UseAxios } from "../services/UseAxios";
import { Loader, Users, FileText, MessageSquare, Briefcase } from "lucide-react";
import dayjs from "dayjs";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await UseAxios("/admin-dashboard");
      if (res.ok) {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">
            Failed to load dashboard data
          </div>
          <p className="text-gray-500 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const getStatIcon = (label) => {
    if (label.includes('Users') || label.includes('Advocates') || label.includes('Clients')) {
      return <Users className="w-5 h-5 text-blue-600" />;
    }
    if (label.includes('Requests') || label.includes('Notifications')) {
      return <MessageSquare className="w-5 h-5 text-green-600" />;
    }
    if (label.includes('Files') || label.includes('Blogs')) {
      return <FileText className="w-5 h-5 text-orange-600" />;
    }
    return <Briefcase className="w-5 h-5 text-purple-600" />;
  };

  const statCards = [
    { label: "Total Users", value: data.totalUsers },
    { label: "Staff", value: data.totalStaff },
    { label: "Advocates", value: data.totalAdvocates },
    { label: "Clients", value: data.totalClients },
    { label: "Advocate Requests", value: data.totalRequestsForAdvocate },
    { label: "Service Requests", value: data.totalRequestsForService },
    { label: "File Requests", value: data.totalFileRequests },
    { label: "Blogs", value: data.totalBlogs },
    { label: "Case Files", value: data.totalCaseFiles },
    { label: "Services", value: data.totalServices },
    { label: "Specializations", value: data.totalSpecializations },
  ];

  return (
    <div className="min-h-screen  bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of system statistics and recent activity</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {statCards.map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {value?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                </div>
                <div className="ml-4">
                  {getStatIcon(label)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
              {data.notifications?.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {data.notifications.length} unread
                </span>
              )}
            </div>
          </div>

          <div className="p-6">
            {data.notifications?.length > 0 ? (
              <div className="space-y-4">
                {data.notifications.map((note) => (
                  <div
                    key={note._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {note.title}
                      </h3>
                      <time className="text-xs text-gray-500 whitespace-nowrap">
                        {dayjs(note.createdAt).format("MMM D, YYYY h:mm A")}
                      </time>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {note.message}
                    </p>
                    
                    {note.case_number && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Case:</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {note.case_number}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No unread notifications</p>
                <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;