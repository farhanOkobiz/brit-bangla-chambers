"use client";
import { apiFetch } from "@/api/apiFetch";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Advocate } from "@/types/advocate.interface";

function Page() {
  const { id } = useParams();
  const [advocate, setAdvocate] = useState<Advocate | null>(null);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    const fetchAdvocate = async () => {
      try {
        const res = await apiFetch(`/advocate/profile/advocate/${id}`);
        setAdvocate(res?.data?.advocate);
      } catch (err) {
        console.error("Error fetching advocate:", err);
      }
    };

    fetchAdvocate();
  }, [id]);

  const availableHours = advocate?.available_hours || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6 p-4 bg-white rounded shadow">
              {/* Image */}
              {advocate?.profile_photo_url && (
                <div className="w-32 h-32 relative rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={`${imageUrl}/${advocate.profile_photo_url.replace(
                      /^\/+/,
                      ""
                    )}`}
                    alt={advocate?.user_id?.full_name || "Advocate"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                  />
                </div>
              )}

              {/* Text info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {advocate?.user_id?.full_name || "Advocate"}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {advocate?.designation}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>Bar Enroll: {advocate?.bar_council_enroll_num}</span>
                  <span>Experience: {advocate?.experience_years} years</span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 md:ml-8">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {advocate?.avg_rating || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {advocate?.total_reviews} reviews
                  </div>
                </div>
                {advocate?.featured && (
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
                {advocate?.bio || "No bio available."}
              </p>
            </div>

            {/* Available Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Hours
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(availableHours)?.map(([day, hours]) => (
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
                    {advocate?.stats?.total_consultations || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Consultations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {advocate?.stats?.weekly_bookings || 0}
                  </div>
                  <div className="text-sm text-gray-500">Weekly Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900">
                    {advocate?.stats?.last_consultation
                      ? new Date(
                          advocate?.stats?.last_consultation
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">Last Consultation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Consultation Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Consultation
              </h2>
              <div
                className={`px-4 py-3 rounded-lg text-center font-medium ${
                  advocate?.consultation_available
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {advocate?.consultation_available
                  ? "Available"
                  : "Not Available"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
