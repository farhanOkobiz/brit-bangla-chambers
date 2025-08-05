"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const DataList = ({
  title,
  data = [],
  loading = false,
  onEdit,
  onDelete,
  renderItem,
  emptyMessage = "No items found",
  searchPlaceholder = "Search items...",
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  console.log("DataList rendered with data:", data);

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Check common fields
    if (item.name?.toLowerCase().includes(searchLower)) return true;
    if (item.details?.toLowerCase().includes(searchLower)) return true;
    if (item.title?.toLowerCase().includes(searchLower)) return true;
    if (item.description?.toLowerCase().includes(searchLower)) return true;

    // Check advocate-specific fields
    if (item.user_id?.full_name?.toLowerCase().includes(searchLower))
      return true;
    if (item.user_id?.email?.toLowerCase().includes(searchLower)) return true;
    if (item.user_id?.phone?.toLowerCase().includes(searchLower)) return true;
    if (item.designation?.toLowerCase().includes(searchLower)) return true;
    if (item.bar_council_enroll_num?.toLowerCase().includes(searchLower))
      return true;
    if (item.bio?.toLowerCase().includes(searchLower)) return true;
    if (item.status?.toLowerCase().includes(searchLower)) return true;

    // Check blog-specific fields
    if (item.author?.toLowerCase().includes(searchLower)) return true;
    if (item.content?.toLowerCase().includes(searchLower)) return true;

    // Check service-specific fields
    if (item.service_name?.toLowerCase().includes(searchLower)) return true;
    if (item.service_description?.toLowerCase().includes(searchLower))
      return true;

    return false;
  });

  console.log("filteredData : ", filteredData);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">
            {title}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredData.length} {filteredData.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            />
          </div>
        )}
      </div>

      {/* List with Fixed Height and Scrollbar */}
      <div className="h-96 lg:h-3/4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2 text-sm lg:text-base">
                Loading...
              </p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlus className="h-5 w-5 lg:h-6 lg:w-6 text-gray-400" />
              </div>
              <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No matching items found" : "No items yet"}
              </h3>
              <p className="text-gray-500 text-sm lg:text-base">
                {searchTerm
                  ? `No items match "${searchTerm}". Try a different search term.`
                  : emptyMessage}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredData.map((item) => (
              <div
                key={item._id}
                className="p-4 lg:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Custom Item Rendering */}
                  <div className="flex-1 min-w-0">
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <DefaultItemRenderer item={item} />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Default item renderer
const DefaultItemRenderer = ({ item }) => (
  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
    {/* Image */}
    <div className="flex-shrink-0">
      {item.image || item.profile_photo_url ? (
        <img
          src={item.image || item.profile_photo_url || "/placeholder.svg"}
          alt={item.name || item.user_id?.full_name || "Item"}
          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">No Image</span>
        </div>
      )}
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <h3 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
        {item.name || item.user_id?.full_name || item.title || "Unnamed Item"}
      </h3>
      {(item.details || item.bio || item.description) && (
        <p className="text-gray-600 text-sm lg:text-base mt-1 line-clamp-2">
          {item.details || item.bio || item.description}
        </p>
      )}
      {item.user_id?.email && (
        <p className="text-blue-600 text-sm mt-1">{item.user_id.email}</p>
      )}
      {item.designation && (
        <p className="text-green-600 text-sm mt-1">{item.designation}</p>
      )}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm lg:text-base mt-1 inline-block"
        >
          View Link →
        </a>
      )}
      <p className="text-xs lg:text-sm text-gray-400 mt-2">
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

export default DataList;
