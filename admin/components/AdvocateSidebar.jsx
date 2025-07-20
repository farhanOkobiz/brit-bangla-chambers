import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const menuItems = [
  { label: "Dashboard", path: "/advocate/dashboard" },
  { label: "My Cases", path: "/advocate/cases" },
  { label: "Appointments", path: "/advocate/appointments" },
  { label: "Clients", path: "/advocate/clients" },
  {
    label: "Blogs",
    isDropdown: true,
    subItems: [
      { label: "All Blogs", path: "/advocate/dashboard/blogs" },
      { label: "Create Blog", path: "/advocate/dashboard/create-blog" },
    ],
  },
  { label: "Settings", path: "/advocate/settings" },
];

const AdvocateSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState("");

  const toggleDropdown = (label) => {
    if (openDropdown === label) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(label);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-blue-600 text-white flex justify-between items-center p-4">
        <h2 className="text-lg font-bold">Advocate Panel</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r z-40 w-64 transform transition-transform duration-300
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="p-4 border-b font-bold text-xl text-blue-700 hidden md:block">
          Advocate Panel
        </div>
        <nav className="flex flex-col p-4 space-y-2 ">
          {menuItems.map((item) =>
            item.isDropdown ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="w-full text-left text-blue-700 px-3 py-2 rounded hover:bg-blue-100 flex justify-between items-center cursor-pointer"
                >
                  {item.label}
                  {openDropdown === item.label ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>
                {openDropdown === item.label && (
                  <div className="ml-4 flex flex-col space-y-1 cursor-pointer">
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="text-gray-600 px-3 py-1 rounded hover:bg-blue-50 transition"
                        onClick={() => setIsOpen(false)}
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
                className="text-gray-700 px-3 py-2 rounded hover:bg-blue-100 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdvocateSidebar;
