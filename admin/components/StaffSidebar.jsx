"use client";

import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaGavel,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaUsers,
  FaClipboardList,
  FaConciergeBell,
  FaTags,
  FaBlogger,
  FaEnvelope,
  FaQuestion,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { UseAuth } from "../auth/AuthContext";
import { logout } from "../auth/api";

const menuItems = [
  { label: "Dashboard", path: "/staff/dashboard", icon: <FaTachometerAlt /> },
  { label: "Profile", path: "/staff/profile", icon: <FaUser /> },
  {
      label: "User Management",
      path: "/staff/user-management",
      icon: <FaUsers />,
  },
  {
    label: "Specialization",
    path: "/staff/specialization",
    icon: <FaClipboardList />,
  },
  {
    label: "Service Requests",
    path: "/staff/messages/service",
    icon: <FaConciergeBell />,
  },
  {
    label: "Subcategories",
    path: "/staff/sub-categories",
    icon: <FaTags />,
  },
  { label: "Services", path: "/staff/services", icon: <FaCog /> },
  { label: "Case file", path: "/staff/case-file", icon: <FaCog /> },
  {
    label: "Advocates",
    isDropdown: true,
    icon: <FaGavel />,
    subItems: [
      { label: "Manage Advocates", path: "/staff/advocates" },
      { label: "Advocate Approvals", path: "/staff/advocates/management" },
      { label: "Create Advocate", path: "/staff/advocates/create" },
    ],
  },
    {
      label: "Blogs",
      isDropdown: true,
      icon: <FaBlogger />,
      subItems: [
        {
          label: "All Blogs",
          path: "/staff/dashboard/blogs",
          icon: <FaBlogger />,
        },
        {
          label: "Create Blog",
          path: "/staff/dashboard/create-blog",
          icon: <FaBlogger />,
        },
      ],
    },
    {
      label: "Contact Messages",
      path: "/staff/messages/contact",
      icon: <FaEnvelope />,
    },
    {
      label: "Help & Support",
      path: "/staff/help-and-support",
      icon: <FaQuestion />,
    },
    { label: "Settings", path: "/staff/settings", icon: <FaCog /> },

];

const StaffSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { pathname } = useLocation();
  const IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL;
  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };
  const {
    setAuthed,
    setRole,
    setUserName,
    setProfilePhoto,
    userName,
    profilePhoto,
  } = UseAuth();

  const handleLogOut = () => {
    try {
      const response = logout();
      if (response) {
        setAuthed(false);
        setRole(null);
        setUserName(null);
        setProfilePhoto(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
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

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Staff Panel</h1>
          </div>

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
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="/placeholder.svg?height=32&width=32"
              alt="Admin"
            />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "64px" }}
      >
        <div className="h-full overflow-y-auto">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Staff Panel</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full text-left px-4 py-3 flex justify-between items-center rounded-xl text-base font-medium transition-all duration-200 ${
                        openDropdown === item.label
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
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
                                : "text-gray-600 hover:bg-white hover:text-blue-600"
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
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      pathname === item.path
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </div>

            {/* User Profile Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <button className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3">
                  <FaSignOutAlt />
                  <button onClick={() => handleLogOut()}>Logout</button>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        {/* Desktop Logo */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Staff Panel</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="px-4 py-6 overflow-y-auto h-full pb-32">
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
                    <div className="flex items-center space-x-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
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
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </div>

          {/* Desktop User Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <img
                className="h-8 w-8 rounded-full border border-white shadow-sm object-cover"
                src={`${IMAGE_URL}${
                  profilePhoto || "/placeholder.svg?height=32&width=32"
                }`}
                alt="Admin"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  Admin User
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {userName}
                  {" - Admin"}
                </p>
              </div>
              <button
                onClick={() => handleLogOut()}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt className="h-4 w-4" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default StaffSidebar;

