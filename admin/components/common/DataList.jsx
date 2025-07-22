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

  const filteredData = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
      <div className="h-80 lg:h-96 overflow-y-auto">
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
                No items yet
              </h3>
              <p className="text-gray-500 text-sm lg:text-base">
                {emptyMessage}
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
      {item.image ? (
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
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
        {item.name}
      </h3>
      {item.details && (
        <p className="text-gray-600 text-sm lg:text-base mt-1 line-clamp-2">
          {item.details}
        </p>
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
