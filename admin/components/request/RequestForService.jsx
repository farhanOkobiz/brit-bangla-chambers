import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../../services/useAxios";
import {
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiPaperclip,
  FiClock,
  FiFileText,
  FiFilter,
  FiSearch,
  FiMoreVertical,
  FiEye,
  FiSend,
  FiUserCheck,
} from "react-icons/fi";

const getStatusConfig = (status) => {
  const configs = {
    accepted: {
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-400",
    },
    rejected: {
      color: "red",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-400",
    },
    pending: {
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-400",
    },
    sent_to_advocate: {
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-400",
    },
  };

  return (
    configs[status] || {
      color: "gray",
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      dot: "bg-gray-400",
    }
  );
};

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  const text =
    status
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Unknown";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text} ${config.border} border`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      {text}
    </div>
  );
};

const StatsCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-6 border border-opacity-20`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
      </div>
      <div
        className={`p-3 rounded-lg ${color
          .replace("text-", "bg-")
          .replace("-600", "-100")}`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

function RequestForService() {
  const [requestsMessage, setRequestsMessage] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedAdvocates, setSelectedAdvocates] = useState({});
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const BASE_URL = import.meta.env.VITE_API_IMAGE_URL;
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await useAxios("/request-service");
      setRequestsMessage(res.data.data);
      setFilteredRequests(res.data.data);
    } catch (error) {
      toast.error("Failed to load requests");
      console.error("Fetch requests error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      setDeleting((prev) => ({ ...prev, [id]: true }));
      await useAxios(`/request-service/${id}`, { method: "DELETE" });
      setRequestsMessage((prev) => prev.filter((item) => item._id !== id));
      setFilteredRequests((prev) => prev.filter((item) => item._id !== id));
      toast.success("Request deleted successfully");
    } catch (error) {
      toast.error("Failed to delete request");
      console.error("Delete error:", error);
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
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
      const res = await useAxios(`/request-for-advocate`, {
        method: "POST",
        data: {
          userMessage: item.userMessage,
          userMessageId: item._id,
          advocateId,
          client_id: item?.clientId,
        },
      });

      if (res.status === 201) {
        toast.success("Message sent to advocate!");
        const updatedRequests = requestsMessage.map((req) =>
          req._id === item._id
            ? {
                ...req,
                adminForwarded: true,
                forwardedTo: advocateId,
                status: "sent_to_advocate",
              }
            : req
        );
        setRequestsMessage(updatedRequests);
        applyFilters(updatedRequests, searchTerm, statusFilter);
      } else {
        toast.warning(res.data.message || "Failed to send");
      }
    } catch (error) {
      toast.error("An error occurred while sending to advocate.");
      console.error("Send to advocate error:", error);
    }
  };

  const applyFilters = (requests, search, status) => {
    let filtered = requests;

    if (search) {
      filtered = filtered.filter(
        (request) =>
          request.userMessage.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          request.userMessage.email
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          request.userMessage.phone?.includes(search) ||
          request.userMessage.issueType
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((request) => request.status === status);
    }

    setFilteredRequests(filtered);
  };

  useEffect(() => {
    applyFilters(requestsMessage, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, requestsMessage]);

  useEffect(() => {
    async function getAllAdvocates() {
      try {
        const res = await useAxios("auth/users");
        const allUsers = res?.data?.users || [];
        const onlyAdvocates = allUsers.filter(
          (user) => user.role === "advocate"
        );
        setAdvocates(onlyAdvocates);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
        toast.error("Failed to load advocates");
      }
    }

    getAllAdvocates();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = {
    total: requestsMessage.length,
    pending: requestsMessage.filter((r) => r.status === "pending").length,
    sent: requestsMessage.filter((r) => r.status === "sent_to_advocate").length,
    accepted: requestsMessage.filter((r) => r.status === "accepted").length,
    rejected: requestsMessage.filter((r) => r.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Service Requests Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage and assign client requests to advocates
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 lg:min-w-96">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent_to_advocate">Sent to Advocate</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            icon={FiFileText}
            title="Total Requests"
            value={stats.total}
            color="text-slate-600"
            bgColor="bg-white"
          />
          <StatsCard
            icon={FiClock}
            title="Pending"
            value={stats.pending}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatsCard
            icon={FiSend}
            title="Sent to Advocate"
            value={stats.sent}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatsCard
            icon={FiUserCheck}
            title="Accepted"
            value={stats.accepted}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatsCard
            icon={FiTrash2}
            title="Rejected"
            value={stats.rejected}
            color="text-red-600"
            bgColor="bg-red-50"
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredRequests.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {requestsMessage.length}
            </span>{" "}
            requests
          </p>
          {filteredRequests.length !== requestsMessage.length && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 mb-6">
                <FiFileText className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm || statusFilter !== "all"
                  ? "No matching requests"
                  : "No requests yet"}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria to find what you're looking for."
                  : "When clients submit service requests, they will appear here for you to review and assign to advocates."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filteredRequests.map((item) => {
              const { userMessage } = item;
              const service = userMessage.serviceId;
              const isDeleting = deleting[item._id];
              const assignedAdvocate = advocates.find(
                (a) => a._id === item.forwardedTo
              );

              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    isDeleting ? "opacity-50 pointer-events-none" : ""
                  }`}
                  style={{ minHeight: "unset" }}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <StatusBadge status={item.status} />
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <FiClock className="w-4 h-4 mr-1" />
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <button
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button> */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={isDeleting}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete request"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  {service ? (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <img
                            src={service.serviceImage}
                            alt={service.title}
                            className="w-12 h-12 object-cover rounded-xl border-2 border-white shadow-md"
                            onError={(e) => {
                              e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiNGMUY1RjkiLz4KPHBhdGggZD0iTTMyIDQ4QzQwLjgzNjYgNDggNDggNDAuODM2NiA0OCAzMkM0OCAyMy4xNjM0IDQwLjgzNjYgMTYgMzIgMTZDMjMuMTYzNCAxNiAxNiAyMy4xNjM0IDE2IDMyQzE2IDQwLjgzNjYgMjMuMTYzNCA0OCAzMiA0OFoiIGZpbGw9IiNFMkU4RjAiLz4KPHBhdGggZD0iTTI4IDI4QzI4IDI1Ljc5MDkgMjkuNzkwOSAyNCAzMiAyNEMzNC4yMDkxIDI0IDM2IDI1Ljc5MDkgMzYgMjhDMzYgMzAuMjA5MSAzNC4yMDkxIDMyIDMyIDMyQzI5Ljc5MDkgMzIgMjggMzAuMjA5MSAyOCAyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTI4IDM2QzI4IDM0Ljg5NTQgMjguODk1NCAzNCAzMCAzNEgzNEMzNS4xMDQ2IDM0IDM2IDM0Ljg5NTQgMzYgMzZWMzhDMzYgMzkuMTA0NiAzNS4xMDQ2IDQwIDM0IDQwSDMwQzI4Ljg5NTQgNDAgMjggMzkuMTA0NiAyOCAzOFYzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                            }}
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <FiFileText className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-blue-900 text-base mb-0 leading-tight">
                            {service.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center gap-2">
                      <div className="relative">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-white shadow-md bg-blue-100">
                          <FiFileText className="w-6 h-6 text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-blue-900 text-base mb-0 leading-tight">
                          No service selected
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Client Information */}
                  <div className="p-3 space-y-3">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiUser className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Client Name
                          </p>
                          <p className="font-semibold text-gray-900 truncate">
                            {userMessage.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FiMail className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Email
                            </p>
                            <p className="text-sm text-gray-900 truncate">
                              {userMessage.email || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FiPhone className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Phone
                            </p>
                            <p className="text-sm text-gray-900">
                              {userMessage.phone || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issue Details */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-2 border border-orange-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <FiMessageSquare className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                              Specilization
                            </p>
                            <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full text-xs font-medium">
                              {userMessage.issueType || "Not specified"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {userMessage.message || "No message provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Attachments (always show) */}
                    <div className="bg-indigo-50 rounded-xl p-2 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FiPaperclip className="w-4 h-4 text-indigo-600" />
                        </div>
                        <p className="font-medium text-indigo-900">
                          Attachments (
                          {userMessage.attachments &&
                          userMessage.attachments.length > 0
                            ? userMessage.attachments.length
                            : "null"}
                          )
                        </p>
                      </div>
                      <div className="grid gap-2">
                        {userMessage.attachments &&
                        userMessage.attachments.length > 0 ? (
                          userMessage.attachments.map((file, idx) => (
                            <a
                              download
                              key={idx}
                              href={`${BASE_URL}${
                                file.startsWith("/") ? file : "/" + file
                              }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200"
                            >
                              <FiFileText className="w-4 h-4 text-indigo-600" />
                              <span className="text-sm text-indigo-900 font-medium">
                                Document {idx + 1}
                              </span>
                            </a>
                          ))
                        ) : (
                          <span className="text-sm text-indigo-900 font-medium">
                            No attachments (null)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 p-3 border-t border-gray-100">
                    {!(item.adminForwarded && item.status !== "rejected") ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Assign to Advocate
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                            value={selectedAdvocates[item._id] || ""}
                            onChange={(e) =>
                              handleSelectChange(item._id, e.target.value)
                            }
                          >
                            <option value="">Choose an advocate...</option>
                            {advocates.map((adv) => (
                              <option key={adv._id} value={adv._id}>
                                {adv.full_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleSendToAdvocate(item)}
                          disabled={!selectedAdvocates[item._id]}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                        >
                          <FiSend className="w-4 h-4" />
                          Send to Advocate
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                          <div className="flex items-center justify-center gap-2">
                            <FiUserCheck className="w-5 h-5" />
                            Successfully Forwarded
                          </div>
                        </div>
                        {assignedAdvocate && (
                          <p className="text-sm text-gray-600 mt-3 font-medium">
                            Assigned to:{" "}
                            <span className="text-blue-600">
                              {assignedAdvocate.full_name}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestForService;
