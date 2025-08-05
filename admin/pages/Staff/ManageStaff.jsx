import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UseAxios } from "../../services/UseAxios";
import Swal from "sweetalert2";

function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  });

  if (!result.isConfirmed) return;

  // Show loading
 

  const res = await UseAxios(`/staff/${id}`, {
    method: "DELETE",
  });

  Swal.close(); // Close loading

  if (res.ok) {
    setStaffList((prev) => prev.filter((staff) => staff._id !== id));
    Swal.fire("Deleted!", "Staff has been deleted.", "success");
  } else {
    Swal.fire("Error", res.data?.message || "Failed to delete staff", "error");
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

  if (loading) return <p>Loading staff data...</p>;

  return (
    <div className="mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Manage Staff</h2>
      <Link
        to="/admin/staff/create"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add New Staff
      </Link>

      {staffList.length === 0 ? (
        <p>No staff found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">NID Number</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{staff.fullName}</td>
                <td className="border border-gray-300 px-4 py-2">{staff.email}</td>
                <td className="border border-gray-300 px-4 py-2">{staff.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{staff.nidNumber}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2 flex justify-center gap-4">
                    <Link
                        to={`/admin/staff/edit/${staff._id}`}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => handleDelete(staff._id)}
                        className="text-red-600 hover:underline cursor-pointer"
                    >
                        Delete
                    </button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageStaff;
