import React, { useEffect, useState } from "react";
import { useAxios } from "../../services/UseAxios";

const AdvocateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const res = await useAxios("/advocate/profile");
      console.log(res);
      if (res.ok) {
        setProfile(res.data);
      } else {
        setError(res.data?.message || "Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-800 font-medium">Error</div>
          <div className="text-red-600 mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (!profile || !profile.advocate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">No profile found.</div>
      </div>
    );
  }

  const { user, advocate } = profile;
  const availableHours = advocate.available_hours || {};
  const contact = advocate.contact || {};
  const fee = advocate.fee_structure || {};
  const stats = advocate.stats || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.full_name || "Advocate"}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {advocate.designation}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Bar Enroll: {advocate.bar_council_enroll_num}</span>
                <span>Experience: {advocate.experience_years} years</span>
                <span
                  className={`px-3 py-1 rounded-full ${
                    advocate.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {advocate.status}
                </span>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:ml-8">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {advocate.avg_rating || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {advocate.total_reviews} reviews
                  </div>
                </div>
                {advocate.featured && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {advocate.bio || "No bio available."}
              </p>
            </div>

            {/* Available Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Hours
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(availableHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-gray-900 capitalize">
                      {day}
                    </span>
                    <span className="text-gray-600">{hours || "Closed"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.total_consultations || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Consultations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.weekly_bookings || 0}
                  </div>
                  <div className="text-sm text-gray-500">Weekly Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900">
                    {stats.last_consultation
                      ? new Date(stats.last_consultation).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">Last Consultation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-gray-900">{user?.email || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Phone</div>
                  <div className="text-gray-900">
                    {user?.phone || contact.phone || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Office Address
                  </div>
                  <div className="text-gray-900">
                    {advocate.office_address || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(contact.facebook || contact.linkedin) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Social Links
                </h2>
                <div className="space-y-3">
                  {contact.facebook && (
                    <a
                      href={contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Facebook Profile
                    </a>
                  )}
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Fee Structure */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Fee Structure
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Base Fee
                  </div>
                  <div className="text-gray-900 font-medium">
                    {fee.base_fee ? `$${fee.base_fee}` : "Contact for pricing"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Public Display
                  </div>
                  <div className="text-gray-900">
                    {fee.show_publicly ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Consultation
              </h2>
              <div
                className={`px-4 py-3 rounded-lg text-center font-medium ${
                  advocate.consultation_available
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {advocate.consultation_available
                  ? "Available"
                  : "Not Available"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvocateProfile;
