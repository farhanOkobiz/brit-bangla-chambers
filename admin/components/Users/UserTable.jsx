"use client";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { getStatusColor } from "./userUtils";

const UserTable = ({ users, userType, onViewDetails, onEdit, onDelete }) => {
const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;
  return (
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
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.profile_photo || user.profile_photo_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            user.profile_photo
                              ? `${IMAGE_URL}${user.profile_photo}`
                              : user.profile_photo_url
                              ? `${IMAGE_URL}${user.profile_photo_url}`
                              : "/placeholder.svg?height=40&width=40"
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
                      onClick={() => onViewDetails(user)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <FaEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Edit"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
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

      {users.length === 0 && (
        <div className="text-center py-12">
          <FaUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No users have been created yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
