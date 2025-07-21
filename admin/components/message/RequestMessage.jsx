import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../../services/useAxios";
import { FiTrash2 } from "react-icons/fi";

function RequestMessage() {
  const [requestsMessage, setRequestsMessage] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await useAxios("/request-service");

      setRequestsMessage(res.data.data);
    } catch {
      toast.error("Failed to load requests");
    }
  };

  const handleDelete = async (id) => {
    try {
      await useAxios(`/request-service/${id}`, {
        method: "DELETE",
      });

      setRequestsMessage((prev) => prev.filter((item) => item._id !== id));
      toast.success("Request deleted successfully");
    } catch {
      toast.error("Failed to delete request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-5">All Request Messages</h2>

      {requestsMessage.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        requestsMessage.map((item) => (
          <div
            key={item._id}
            className="relative border border-gray-300 rounded-lg p-4 mb-4 bg-gray-100 shadow-sm hover:shadow-md transition"
          >
            {/* 🗑️ Delete Icon */}
            <FiTrash2
              onClick={() => handleDelete(item._id)}
              className="absolute top-3 right-3 text-red-500 cursor-pointer hover:text-red-700"
              size={20}
              title="Delete"
            />

            <p>
              <span className="font-semibold">Name:</span> {item.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {item.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {item.phone}
            </p>
            <p>
              <span className="font-semibold">NID:</span> {item.nid}
            </p>
            <p>
              <span className="font-semibold">Present Address:</span>{" "}
              {item.presentAddress}
            </p>
            <p>
              <span className="font-semibold">Permanent Address:</span>{" "}
              {item.permanentAddress}
            </p>
            <p>
              <span className="font-semibold">Issue Type:</span>{" "}
              {item.issueType}
            </p>
            <p>
              <span className="font-semibold">Message:</span> {item.message}
            </p>
            <p>
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default RequestMessage;
