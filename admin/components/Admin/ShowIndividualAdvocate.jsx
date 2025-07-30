import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseAxios } from "../../services/UseAxios";

export default function ShowIndividualAdvocate() {
  const { id } = useParams();
  const [advocate, setAdvocate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_IMAGE_URL;

  useEffect(() => {
    async function fetchAdvocate() {
      const res = await UseAxios(`/advocate/profile/advocate/${id}`);
      console.log(res);
      if (res.ok) {
        console.log(res.data);
        setAdvocate(res.data.advocate || res.data);
      } else {
        setError(res.data?.message || "Failed to fetch advocate");
      }
      setLoading(false);
    }
    fetchAdvocate();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl text-gray-600">{error}</div>
        </div>
      </div>
    );

  if (!advocate)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <div className="text-xl text-gray-600">No advocate found</div>
        </div>
      </div>
    );

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this advocate?"))
      return;
    const res = await UseAxios(`/advocate/profile/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Advocate deleted successfully.");
      window.location.href = "/admin/advocates";
    } else {
      alert(res.data?.message || "Failed to delete advocate.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-9xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700"></div>
            <div className="absolute inset-0 bg-gray-700 bg-opacity-20"></div>

            {/* Content */}
            <div className="relative px-8 py-12">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-sm">
                    <img
                      src={
                        `${BASE_URL}${advocate.profile_photo_url}` ||
                        "/default-profile.png"
                      }
                      alt={advocate.user_id?.full_name || "Advocate"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {advocate.featured && (
                    <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="text-center lg:text-left text-white flex-1">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                    {advocate.user_id?.full_name || "Advocate Name"}
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-200 mb-4">
                    {advocate.designation || "Legal Professional"}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {advocate.experience_years || 0}
                      </div>
                      <div className="text-gray-300">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {advocate.avg_rating || 0}/5
                      </div>
                      <div className="text-gray-300">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {advocate.total_reviews || 0}
                      </div>
                      <div className="text-gray-300">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {advocate.stats?.total_consultations || 0}
                      </div>
                      <div className="text-gray-300">Consultations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
          <button
            onClick={() =>
              (window.location.href = `/admin/advocates/${id}/edit`)
            }
            className="px-8 py-3 cursor-pointer bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 hover:shadow-sm transform hover:-translate-y-0.5 transition-all duration-200"
          >
            ✏️ Edit Profile
          </button>
          <button
            onClick={handleDelete}
            className="px-8 py-3 cursor-pointer bg-red-600 text-white rounded-xl font-semibold shadow-sm hover:bg-red-700 hover:shadow-sm transform hover:-translate-y-0.5 transition-all duration-200"
          >
            🗑️ Delete
          </button>
          <div
            className={`px-6 py-3 rounded-xl font-semibold shadow-sm ${
              advocate.status === "approved"
                ? "bg-green-100 text-green-800"
                : advocate.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            Status:{" "}
            {advocate.status?.charAt(0).toUpperCase() +
              advocate.status?.slice(1) || "Pending"}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                  ℹ️
                </span>
                About
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {advocate.bio || "No biography provided."}
              </p>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                  🎓
                </span>
                Education
              </h3>
              {Array.isArray(advocate.education_ids) &&
              advocate.education_ids.length > 0 ? (
                <div className="space-y-4">
                  {advocate.education_ids.map((edu) => (
                    <div
                      key={edu._id}
                      className="border-l-4 border-green-500 pl-6 py-3 bg-green-50 rounded-r-lg"
                    >
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {edu.degree_title}
                      </h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        Graduated: {edu.passing_year}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📚</div>
                  <p>No education records found</p>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                  📄
                </span>
                Documents
              </h3>
              {Array.isArray(advocate.document_ids) &&
              advocate.document_ids.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advocate.document_ids.map((doc) => (
                    <div
                      key={doc._id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 truncate flex-1">
                          {doc.file_name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            doc.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {doc.verified ? "✓ Verified" : "⏳ Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {doc.document_type}
                      </p>
                      {doc.file_url && (
                        <a
                          download={doc.file_url}
                          href={`${BASE_URL}${doc.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          🔗 View Document →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No documents uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-xs">
                  📞
                </span>
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                    ✉️
                  </span>
                  <span className="text-gray-700">
                    {advocate.user_id?.email || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                    📱
                  </span>
                  <span className="text-gray-700">
                    {advocate.contact?.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mr-3 text-sm mt-0.5">
                    🏢
                  </span>
                  <span className="text-gray-700 leading-relaxed">
                    {advocate.office_address || "Not provided"}
                  </span>
                </div>
                {advocate.contact?.facebook && (
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                      f
                    </span>
                    <a
                      href={advocate.contact.facebook}
                      className="text-blue-600 hover:underline"
                    >
                      Facebook Profile
                    </a>
                  </div>
                )}
                {advocate.contact?.linkedin && (
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">
                      in
                    </span>
                    <a
                      href={advocate.contact.linkedin}
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Memberships */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-3 text-xs">
                  ⚖️
                </span>
                Bar Memberships
              </h3>
              {Array.isArray(advocate.bar_memberships) &&
              advocate.bar_memberships.length > 0 ? (
                <div className="space-y-3">
                  {advocate.bar_memberships.map((bar, index) => (
                    <div
                      key={bar._id || index}
                      className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 rounded-r-lg"
                    >
                      <h4 className="font-semibold text-gray-800">
                        {bar.bar_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Member #: {bar.membership_number}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <div className="text-3xl mb-2">⚖️</div>
                  <p className="text-sm">No memberships listed</p>
                </div>
              )}
            </div>

            {/* Languages */}
            {Array.isArray(advocate.languages) &&
              advocate.languages.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-xs">
                      🌐
                    </span>
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {advocate.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Fee Structure */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 text-xs">
                  💰
                </span>
                Fee Structure
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fee:</span>
                  <span className="font-semibold text-gray-800">
                    ${advocate.fee_structure?.base_fee || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Public Display:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      advocate.fee_structure?.show_publicly
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {advocate.fee_structure?.show_publicly ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Consultation:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      advocate.consultation_available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {advocate.consultation_available
                      ? "Available"
                      : "Not Available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Hours Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mr-3 text-sm">
              🕐
            </span>
            Available Hours
          </h3>
          {advocate.available_hours &&
          Object.keys(advocate.available_hours).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(advocate.available_hours).map(([day, hours]) => (
                <div
                  key={day}
                  className="text-center p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                >
                  <div className="font-semibold text-gray-800 mb-2">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {hours || "Not Available"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>No schedule information available</p>
            </div>
          )}
        </div>

        {/* Statistics Footer */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Performance Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {advocate.stats?.total_consultations || 0}
              </div>
              <div className="text-blue-800 font-medium">
                Total Consultations
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {advocate.stats?.weekly_bookings || 0}
              </div>
              <div className="text-green-800 font-medium">Weekly Bookings</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-lg font-bold text-purple-600 mb-2">
                {advocate.stats?.last_consultation
                  ? new Date(
                      advocate.stats.last_consultation
                    ).toLocaleDateString()
                  : "Never"}
              </div>
              <div className="text-purple-800 font-medium">
                Last Consultation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
