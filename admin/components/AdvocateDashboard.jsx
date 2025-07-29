import React from "react";

const messagesData = [
  {
    name: "John Doe",
    email: "john@example.com",
    issue: "Property dispute",
    status: "pending",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    issue: "Divorce case",
    status: "resolved",
  },
  {
    name: "Rahim Uddin",
    email: "rahim@example.com",
    issue: "Land ownership",
    status: "pending",
  },
  {
    name: "Salma Akter",
    email: "salma@example.com",
    issue: "Inheritance issue",
    status: "resolved",
  },
];

function AdvocateDashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Welcome, Advocate!</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Messages
          </h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {messagesData.length}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Pending Requests
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {messagesData.filter((msg) => msg.status === "pending").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Resolved Issues
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {messagesData.filter((msg) => msg.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Messages
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Issue</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {messagesData.map((msg, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-2 px-4">{msg.name}</td>
                  <td className="py-2 px-4">{msg.email}</td>
                  <td className="py-2 px-4">{msg.issue}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        msg.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdvocateDashboard;
