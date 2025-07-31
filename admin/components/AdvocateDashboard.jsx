import React, { useEffect, useState } from "react";
import { UseAxios } from "../services/UseAxios.js"; // adjust the path based on your project
import { Loader } from "lucide-react"; // optional icon, requires `lucide-react`

const AdvocateDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await UseAxios("/advocate-dashboard/information");
      if (res.ok) {
        setData(res.data);
      }
      setLoading(false);
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load dashboard information.
      </div>
    );
  }

  const { blogs, caseFiles, fileRequests , requests } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 max-w-5xl mx-auto">
      <DashboardCard label="Blogs" count={blogs} color="bg-blue-100" />
      <DashboardCard label="Case Files" count={caseFiles} color="bg-green-100" />
      <DashboardCard label="File Requests" count={fileRequests} color="bg-yellow-100" />
     
    <div className="col-span-1 sm:col-span-3 mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
      <ul className="space-y-2">
        {requests.map((request) => (
          <li
            key={request._id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <p className="text-gray-800">
              Request from: {request.clientId.full_name} 
              <span className="text-sm text-gray-500">{request.service}</span>
              {/* condition color for status */}
              {request.status == "pending" ? (
                <span className="text-yellow-600 ml-2">Pending</span>
              ) : request.status == "accepted" ? (
                <span className="text-green-600 ml-2">Accepted</span>
              ) : (
                <span className="text-red-600 ml-2">Rejected</span>
              )
              }
            </p>
            <span className="text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>

      </div>
       <div className="col-span-1 sm:col-span-3">
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <ul className="space-y-2">
          {data.notifications.map((notification) => (
            <li
              key={notification._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <p className="text-gray-800">{notification.message}</p>
              <span className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul> 
    </div>
      </div>
  );
};

const DashboardCard = ({ label, count, color }) => (
  <div
    className={`rounded-2xl shadow-sm p-6 text-center ${color} hover:shadow-md transition`}
  >
    <h2 className="text-3xl font-semibold text-gray-800">{count}</h2>
    <p className="text-sm text-gray-600 mt-2">{label}</p>
  </div>
);

export default AdvocateDashboard;
