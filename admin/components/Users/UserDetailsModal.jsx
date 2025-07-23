"use client";

import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaMapMarkerAlt,
  FaGavel,
  FaTimes,
} from "react-icons/fa";
import { getStatusColor } from "./userUtils";

const UserDetailsModal = ({
  user,
  userType,
  onClose,
  onStatusUpdate,
  getStatusOptions,
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
                      "/placeholder.svg?height=80&width=80"
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

export default UserDetailsModal;
