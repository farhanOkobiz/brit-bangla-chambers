"use client";

import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUser,
  FaFolderOpen,
  FaCogs,
  FaChartBar,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
  { label: "Users", path: "/admin/users", icon: <FaUser /> },
  { label: "Cases", path: "/admin/cases", icon: <FaFolderOpen /> },
  { label: "Categories", path: "/admin/categories", icon: <FaFolderOpen /> },
  {
    label: "Subcategories",
    path: "/admin/sub-categories",
    icon: <FaFolderOpen />,
  },
  { label: "Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
  {
    label: "Message",
    isDropdown: true,
    icon: null,
    subItems: [
      { label: "Contact Message", path: "/admin/messages/contact" },
      { label: "Service Message", path: "/admin/messages/service" },
    ],
  },
  { label: "Settings", path: "/admin/settings", icon: <FaCogs /> },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { pathname } = useLocation();

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Adminto</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <FaTimes size={20} className="text-gray-600" />
          ) : (
            <FaBars size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Adminto</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              NAVIGATION
            </p>
            <div className="space-y-1">
              {menuItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full text-left px-3 py-2 flex justify-between items-center rounded-lg text-sm font-medium ${
                        openDropdown === item.label
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      {openDropdown === item.label ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-1.5 rounded text-sm ${
                              pathname === subItem.path
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-blue-50"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Apps Section */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              APPS
            </p>
            <div className="space-y-1">
              <Link
                to="/admin/calendar"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="text-gray-400">📅</span>
                <span>Calendar</span>
              </Link>
              <Link
                to="/admin/chat"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="text-gray-400">💬</span>
                <span>Chat</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
