import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UseAxios } from "../../services/UseAxios";
import Swal from "sweetalert2";

function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageUrl = import.meta.env.VITE_API_IMAGE_URL;

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Deleting...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const res = await UseAxios(`/staff/${id}`, {
      method: "DELETE",
    });

    Swal.close();

    if (res.ok) {
      setStaffList((prev) => prev.filter((staff) => staff._id !== id));
      Swal.fire("Deleted!", "Staff has been deleted.", "success");
    } else {
      Swal.fire(
        "Error",
        res.data?.message || "Failed to delete staff",
        "error"
      );
    }
  };

  useEffect(() => {
    async function fetchStaff() {
      const res = await UseAxios("/staff");
      if (res.ok) {
        setStaffList(res.data.staffs || []);
      }
      setLoading(false);
    }

    fetchStaff();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Staff card for mobile view
  const StaffCard = ({ staff }) => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {staff.fullName}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{staff.email}</p>
        </div>
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="text-xs text-gray-500">Phone</p>
          <p className="text-gray-700">{staff.phone}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">NID Number</p>
          <p className="text-gray-700">{staff.nidNumber}</p>
        </div>
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
        <Link
          to={`/admin/staff/edit/${staff._id}`}
          className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
        >
          Edit
        </Link>
        <button
          onClick={() => handleDelete(staff._id)}
          className="px-4 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Staff Management
                </h1>
                <p className="text-blue-100 mt-2">
                  Manage your organization's staff members
                </p>
              </div>
              <Link
                to="/admin/staff/create"
                className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Staff
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="px-6 py-6 sm:px-8 border-b border-gray-100">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 w-full max-w-xs">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">
                    {staffList.length}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 sm:px-8">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Staff Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      NID Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg">No staff members found</p>
                          <p className="mt-2">
                            Add your first staff member using the "Add New
                            Staff" button
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    staffList.map((staff) => (
                      <tr key={staff._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 border-2 border-dashed rounded-xl" >
                              <img
                                src={staff?.image ? `${imageUrl}${staff.image}` : "/default-avatar.png"}
                                alt={staff.fullName}
                                className="object-cover w-full h-full rounded-xl"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {staff.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {staff.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {staff.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.nidNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-4">
                            <Link
                              to={`/admin/staff/edit/${staff._id}`}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(staff._id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <div className="md:hidden">
              {staffList.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No staff members found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Add your first staff member using the "Add New Staff" button
                  </p>
                </div>
              ) : (
                <div>
                  {staffList.map((staff) => (
                    <StaffCard key={staff._id} staff={staff} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageStaff;
