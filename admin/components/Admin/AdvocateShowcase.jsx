import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAxios } from "../../services/UseAxios";
import { UseAuth } from "../../auth/AuthContext";

export default function AdvocateShowcase() {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_IMAGE_URL;
  const { role } = UseAuth()
 

  useEffect(() => {
    async function fetchAdvocates() {
      const res = await UseAxios("/advocate/all");
      if (res.ok) {
        setAdvocates(res.data);
      } else {
        setError(res.data?.message || "Failed to fetch advocates");
      }
      setLoading(false);
    }
    fetchAdvocates();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-2">⚠️</div>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Advocates Directory
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {advocates.map((adv) => (
            <div
              key={adv._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100 overflow-hidden"
              onClick={() => {
              const base = role === "admin" ? "/admin" : "/staff";
              navigate(`${base}/advocates/${adv._id}`);
            }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={`${BASE_URL}${adv.profile_photo_url}`}
                  alt={adv.user_id?.full_name || "Advocate"}
                  className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {adv.featured && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐
                  </div>
                )}
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                    adv.status === "approved"
                      ? "bg-green-500 text-white"
                      : adv.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {adv.status?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">
                  {adv.user_id?.full_name || "Unknown"}
                </h3>
                <p className="text-blue-600 text-xs font-medium mb-2 truncate">
                  {adv.designation || "Legal Professional"}
                </p>

                {/* Stats Row */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>{adv.experience_years || 0} yrs</span>
                  <span>★ {adv.avg_rating || 0}</span>
                  <span>{adv.total_reviews || 0} reviews</span>
                </div>

                {/* Location */}
                <p className="text-xs text-gray-400 truncate">
                  📍 {adv.office_address || "Location not specified"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {advocates.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl">No advocates found</p>
          </div>
        )}
      </div>
    </div>
  );
}
