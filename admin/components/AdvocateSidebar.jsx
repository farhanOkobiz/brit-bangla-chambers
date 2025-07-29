import { useState } from "react";
import { logout } from "../auth/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import {
  FaUserCircle,
  FaTachometerAlt,
  FaClipboardList,
  FaFolderOpen,
  FaCalendarCheck,
  FaUsers,
  FaBlogger,
  FaCogs,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const menuItems = [
  {
    label: "Advocate Profile",
    path: "/advocate/profile",
    icon: <FaUserCircle />,
  },
  {
    label: "Dashboard",
    path: "/advocate/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    label: "Request",
    path: "/advocate/dashboard/request",
    icon: <FaClipboardList />,
  },
  {
    label: "My Case",
    isDropdown: true,
    icon: <FaFolderOpen />,
    subItems: [
      {
        label: "All user file",
        path: "/advocate/dashboard/all-user-file",
        icon: <FaFolderOpen />,
      },
      // {
      //   label: "Create user file",
      //   path: "/advocate/dashboard/create-user-file",
      //   icon: <FaFolderOpen />,
      // },
    ],
  },
  {
    label: "Appointments",
    path: "/advocate/appointments",
    icon: <FaCalendarCheck />,
  },
  {
    label: "Clients",
    path: "/advocate/clients",
    icon: <FaUsers />,
  },
  {
    label: "Blogs",
    isDropdown: true,
    icon: <FaBlogger />,
    subItems: [
      {
        label: "All Blogs",
        path: "/advocate/dashboard/blogs",
        icon: <FaBlogger />,
      },
      {
        label: "Create Blog",
        path: "/advocate/dashboard/create-blog",
        icon: <FaBlogger />,
      },
    ],
  },
  {
    label: "Settings",
    path: "/advocate/settings",
    icon: <FaCogs />,
  },
];

const AdvocateSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAuthed, setRole, setUserName } = useAuth();

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };
  const handleLogOut = () => {
    try {
      const response = logout();
      if (response) {
        setAuthed(false);
        setRole(null);
        setUserName(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm ">
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
          <h1 className="text-lg font-semibold text-gray-800">
            Advocate Panel
          </h1>
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="/placeholder.svg?height=32&width=32"
            alt="Advocate"
          />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: "64px" }}
      >
        <div className="h-full overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Navigation</h2>
            <div className="space-y-2">
              {menuItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full text-left px-3 py-2 flex justify-between items-center rounded-lg text-sm font-medium cursor-pointer ${
                        openDropdown === item.label
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-lg ${
                            openDropdown === item.label
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="text-blue-700">{item.label}</span>
                      </div>
                      {openDropdown === item.label ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
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
                    <span
                      className={`text-lg ${
                        pathname === item.path
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Profile */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <img
                className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
                src="/placeholder.svg?height=40&width=40"
                alt="Advocate"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Advocate User</h3>
                <p className="text-sm text-gray-600">advocate@example.com</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200">
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed z-30 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-100 via-purple-100 to-purple-200 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight mb-1">
            Advocate Panel
          </h1>
          <p className="text-sm text-gray-600">Management System</p>
        </div>

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
                      <span
                        className={`text-base ${
                          openDropdown === item.label
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
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
                  <span
                    className={`text-base ${
                      pathname === item.path ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </div>

          {/* Desktop Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <img
                className="h-8 w-8 rounded-full border border-white shadow-sm object-cover"
                src="/placeholder.svg?height=32&width=32"
                alt="Advocate"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  Advocate User
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  advocate@example.com
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

export default AdvocateSidebar;
