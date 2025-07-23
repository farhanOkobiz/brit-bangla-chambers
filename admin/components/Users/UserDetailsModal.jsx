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
  const formatStatus = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 overflow-y-auto">
      <div className="relative top-20 mx-auto p-6 bg-white rounded-md shadow-lg border w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatStatus(userType)} Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Profile Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
          <div className="flex-shrink-0">
            {user.profile_photo || user.profile_photo_url ? (
              <img
                src={user.profile_photo || user.profile_photo_url}
                alt={user.user_id?.full_name}
                className="h-20 w-20 rounded-full object-cover"
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
            <div className="mt-2 mb-1">
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  user.status
                )}`}
              >
                {formatStatus(user.status)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {user.user_id.otp_verified
                ? "Profile Verified"
                : "Profile Not Verified"}
            </div>
            <div className="text-sm text-gray-500">
              Profile created: {user.user_id?.created_at}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <section className="mb-6">
          <h5 className="flex items-center font-medium text-gray-900 mb-3">
            <FaEnvelope className="h-4 w-4 mr-2" />
            Contact Information
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Email:</strong> {user.user_id?.email || "Not provided"}
            </div>
            <div>
              <strong>Phone:</strong> {user.user_id?.phone || "Not provided"}
            </div>
          </div>
        </section>

        {/* Client Info */}
        {userType === "client" && (
          <>
            <section className="mb-6">
              <h5 className="flex items-center font-medium text-gray-900 mb-3">
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
            </section>

            <section className="mb-6">
              <h5 className="flex items-center font-medium text-gray-900 mb-3">
                <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                Address Information
              </h5>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Present Address:</strong>
                  <p className="text-gray-600">
                    {user.present_address || "Not provided"}
                  </p>
                </div>
                <div>
                  <strong>Permanent Address:</strong>
                  <p className="text-gray-600">
                    {user.permanent_address || "Not provided"}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Advocate Info */}
        {userType === "advocate" && (
          <>
            <section className="mb-6">
              <h5 className="flex items-center font-medium text-gray-900 mb-3">
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
            </section>

            {user.bio && (
              <section className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Biography</h5>
                <p className="text-sm text-gray-600">{user.bio}</p>
              </section>
            )}

            {user.office_address && (
              <section className="mb-6">
                <h5 className="flex items-center font-medium text-gray-900 mb-3">
                  <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                  Office Address
                </h5>
                <p className="text-sm text-gray-600">{user.office_address}</p>
              </section>
            )}

            {user.contact && (
              <section className="mb-6">
                <h5 className="font-medium text-gray-900 mb-3">
                  Additional Contact
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {user.contact.phone && (
                    <div>
                      <strong>Phone:</strong> {user.contact.phone}
                    </div>
                  )}
                  {user.contact.facebook && (
                    <div>
                      <strong>Facebook:</strong>
                      <a
                        href={user.contact.facebook}
                        className="text-blue-600 ml-1 hover:underline"
                        target="_blank"
                      >
                        View
                      </a>
                    </div>
                  )}
                  {user.contact.linkedin && (
                    <div>
                      <strong>LinkedIn:</strong>
                      <a
                        href={user.contact.linkedin}
                        className="text-blue-600 ml-1 hover:underline"
                        target="_blank"
                      >
                        View
                      </a>
                    </div>
                  )}
                </div>
              </section>
            )}

            {user.fee_structure && (
              <section className="mb-6">
                <h5 className="font-bold text-gray-900 mb-3">Fee Structure</h5>
                <p className="text-sm text-gray-800 mb-1">
                  <strong>Base Fee:</strong>{" "}
                  {user.fee_structure.base_fee || "Not provided"}
                </p>
                <p className="text-sm text-gray-800">
                  <strong>Show Publicly:</strong>{" "}
                  {user.fee_structure.show_publicly ? "Yes" : "No"}
                </p>
              </section>
            )}

            {user.status && (
              <section className="mb-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-3">
                  Status
                </h5>
                <div className="space-y-2 text-sm text-gray-800">
                  <div>
                    <strong>Total Consultations:</strong>{" "}
                    {user.total_consultations || 0}
                  </div>
                  <div>
                    <strong>Weekly Bookings:</strong>{" "}
                    {user.weekly_bookings || 0}
                  </div>
                  <div>
                    <strong>Last Consultation:</strong>{" "}
                    {user.stats?.last_consultation || "N/A"}
                  </div>
                  <div>
                    <strong>Average Rating:</strong> {user.avg_rating ?? 0}
                  </div>
                  <div>
                    <strong>Total Reviews:</strong> {user.total_reviews ?? 0}
                  </div>
                  <div>
                    <strong>Consultation Available:</strong>{" "}
                    {user.consultation_available ? "Yes" : "No"}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Status Change */}
        <section className="mb-6">
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
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </section>

        {/* Footer Buttons */}
        <div className="flex justify-end pt-4 border-t mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
