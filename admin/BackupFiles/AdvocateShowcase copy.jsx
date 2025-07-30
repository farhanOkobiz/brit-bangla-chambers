import React from "react";

const AdvocateShowcase = ({ item, onEdit, onDelete }) => (
  <div className="flex items-center space-x-4 min-h-[150px] py-6">
    <div className="flex-shrink-0">
      {item.profile_photo_url ? (
        <img
          src={item.profile_photo_url}
          alt={item.user_id?.full_name || "Advocate"}
          className="w-16 h-16 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center ${item.profile_photo_url ? "hidden" : ""}`}>
        <span className="text-gray-400 text-xs">No Photo</span>
      </div>
    </div>
    
    <div className="flex-1 min-w-0">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.user_id?.full_name || "Unknown Name"}
        </h3>
        <div className="flex items-center space-x-4 mt-1">
          <p className="text-blue-600 text-sm font-medium">{item.designation || "Advocate"}</p>
          {item.experience_years && (
            <>
              <span className="text-gray-400">•</span>
              <p className="text-green-600 text-sm font-medium">{item.experience_years} years exp.</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center space-x-4 mt-1">
          <p className="text-gray-600 text-sm">{item.user_id?.email || "No email"}</p>
          {item.user_id?.phone && (
            <>
              <span className="text-gray-400">•</span>
              <p className="text-gray-600 text-sm">{item.user_id.phone}</p>
            </>
          )}
        </div>
        
        {item.bar_council_enroll_num && (
          <p className="text-gray-600 text-sm mt-1">
            <span className="font-medium">Bar Council:</span> {item.bar_council_enroll_num}
          </p>
        )}
        
        {item.office_address && (
          <p className="text-gray-600 text-sm mt-1">
            <span className="font-medium">Office:</span> {item.office_address}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.status === "approved" ? "bg-green-100 text-green-800" :
          item.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
        }`}>
          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
        </span>
        
        {item.featured && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Featured
          </span>
        )}
        
        {item.consultation_available && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Available for Consultation
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2 mt-3">
        <button className="text-xs text-blue-600 hover:underline" onClick={() => onEdit(item)}>Edit</button>
        <button className="text-xs text-red-600 hover:underline" onClick={() => onDelete(item._id)}>Delete</button>
      </div>
    </div>
  </div>
);

export default AdvocateShowcase;