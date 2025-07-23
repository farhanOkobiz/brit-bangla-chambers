import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../../services/useAxios";
import { FiTrash2 } from "react-icons/fi";

const advocates = [
  {
    advocateId: "64b8cfe7f123456789abc001",
    advocateName: "Advocate Rahim Uddin",
  },
  {
    advocateId: "64b8cfe7f123456789abc002",
    advocateName: "Advocate Nasrin Akter",
  },
];

const getStatusBadge = (status) => {
  let colorClass = "";
  let text = formatStatusText(status);

  switch (status) {
    case "accepted":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "rejected":
      colorClass = "bg-red-100 text-red-800";
      break;
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
    case "sent_to_advocate":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${colorClass}`}
    >
      {text}
    </span>
  );
};

const formatStatusText = (status) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function RequestMessage() {
  const [requestsMessage, setRequestsMessage] = useState([]);
  const [selectedAdvocates, setSelectedAdvocates] = useState({});

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
      await useAxios(`/request-service/${id}`, { method: "DELETE" });
      setRequestsMessage((prev) => prev.filter((item) => item._id !== id));
      toast.success("Request deleted successfully");
    } catch {
      toast.error("Failed to delete request");
    }
  };

  const handleSelectChange = (requestId, advocateId) => {
    setSelectedAdvocates((prev) => ({
      ...prev,
      [requestId]: advocateId,
    }));
  };

  const handleSendToAdvocate = async (item) => {
    const advocateId = selectedAdvocates[item._id];

    if (!advocateId) {
      toast.warning("Please select an advocate first.");
      return;
    }

    try {
      const res = await useAxios(`/advocate-message`, {
        method: "POST",
        data: {
          userMessage: item.userMessage,
          userMessageId: item._id,
          advocateId,
        },
      });

      if (res.status === 201) {
        toast.success("Message sent to advocate!");
      } else {
        toast.warning(res.data.message || "Failed to send");
      }
    } catch {
      toast.warning("An error occurred.");
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
            <FiTrash2
              onClick={() => handleDelete(item._id)}
              className="absolute top-3 right-3 text-red-500 cursor-pointer hover:text-red-700"
              size={20}
              title="Delete"
            />
            <p>
              <strong>Name:</strong> {item.userMessage.name}
            </p>
            <p>
              <strong>Email:</strong> {item.userMessage.email}
            </p>
            <p>
              <strong>Phone:</strong> {item.userMessage.phone}
            </p>
            <p>
              <strong>NID:</strong> {item.userMessage.nid}
            </p>
            <p>
              <strong>Present Address:</strong>{" "}
              {item.userMessage.presentAddress}
            </p>
            <p>
              <strong>Permanent Address:</strong>{" "}
              {item.userMessage.permanentAddress}
            </p>
            <p>
              <strong>Issue Type:</strong> {item.userMessage.issueType}
            </p>
            <p>
              <strong>Message:</strong> {item.userMessage.message}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>

            {/* Select Advocate */}
            <select
              className="mt-3 w-full border border-gray-300 p-2 rounded"
              value={selectedAdvocates[item._id] || ""}
              onChange={(e) => handleSelectChange(item._id, e.target.value)}
            >
              <option value="">Select Advocate</option>
              {advocates.map((adv) => (
                <option key={adv.advocateId} value={adv.advocateId}>
                  {adv.advocateName}
                </option>
              ))}
            </select>
            <p className="mt-4">
              <strong>Status:</strong> {getStatusBadge(item.status)}
            </p>
            {!item.adminForwarded ? (
              <button
                onClick={() => handleSendToAdvocate(item)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Send to Advocate
              </button>
            ) : (
              <p className="mt-3 text-green-600 font-semibold">
                Message sent to advocate
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RequestMessage;
