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
  FaGavel,
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
  { label: "Services", path: "/admin/services", icon: <FaCogs /> },
  { label: "Advocates", path: "/admin/advocates", icon: <FaGavel /> },
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

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button - Top Left */}
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

          {/* Logo - Center */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Adminto</h1>
          </div>

          {/* User Profile - Right */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5-5-5h5v-12"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
            <img
              className="h-8 w-8 rounded-full"
              src="/placeholder.svg?height=32&width=32"
              alt="Admin"
            />
          </div>
        </div>
      </div>

      {/* Mobile Full Screen Dropdown Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ top: isOpen ? "64px" : "0" }} // Start below the top nav bar
      >
        {/* Menu Content */}
        <div className="h-full overflow-y-auto bg-white">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Adminto</h1>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 py-6">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                NAVIGATION
              </p>
              <div className="space-y-2">
                {menuItems.map((item) =>
                  item.isDropdown ? (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className={`w-full text-left px-4 py-4 flex justify-between items-center rounded-xl text-base font-medium transition-all duration-200 ${
                          openDropdown === item.label
                            ? "bg-blue-50 text-blue-600 shadow-sm"
                            : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        }`}
                      >
                        <span>{item.label}</span>
                        {openDropdown === item.label ? (
                          <FiChevronUp className="text-lg" />
                        ) : (
                          <FiChevronDown className="text-lg" />
                        )}
                      </button>
                      {openDropdown === item.label && (
                        <div className="ml-6 mt-2 space-y-1 bg-gray-50 rounded-lg p-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={closeMenu}
                              className={`block px-4 py-3 rounded-lg text-base transition-all duration-200 ${
                                pathname === subItem.path
                                  ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                                  : "text-gray-600 hover:bg-white hover:text-blue-600 active:bg-blue-50"
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
                      onClick={closeMenu}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                        pathname === item.path
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Apps Section */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
                APPS
              </p>
              <div className="space-y-2">
                <Link
                  to="/admin/calendar"
                  onClick={closeMenu}
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                >
                  <span className="text-xl flex-shrink-0">📅</span>
                  <span>Calendar</span>
                </Link>
                <Link
                  to="/admin/chat"
                  onClick={closeMenu}
                  className="flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                >
                  <span className="text-xl flex-shrink-0">💬</span>
                  <span>Chat</span>
                </Link>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <img
                  className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                  src="/placeholder.svg?height=48&width=48"
                  alt="Admin"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">Admin User</h3>
                  <p className="text-sm text-gray-600">admin@example.com</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200">
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Desktop Logo */}
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

        {/* Desktop Navigation */}
        <nav className="px-4 py-6 overflow-y-auto h-full">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              NAVIGATION
            </p>
            <div className="space-y-1">
              {menuItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full text-left px-3 py-2.5 flex justify-between items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        openDropdown === item.label
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{item.label}</span>
                      {openDropdown === item.label ? (
                        <FiChevronUp className="text-sm" />
                      ) : (
                        <FiChevronDown className="text-sm" />
                      )}
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              pathname === subItem.path
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Desktop Apps Section */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              APPS
            </p>
            <div className="space-y-1">
              <Link
                to="/admin/calendar"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <span className="text-gray-400 text-lg flex-shrink-0">📅</span>
                <span className="truncate">Calendar</span>
              </Link>
              <Link
                to="/admin/chat"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <span className="text-gray-400 text-lg flex-shrink-0">💬</span>
                <span className="truncate">Chat</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
