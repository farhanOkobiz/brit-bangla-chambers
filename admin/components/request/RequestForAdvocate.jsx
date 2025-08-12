import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UseAxios } from "../../services/UseAxios.js";
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  User,
  FileText,
  Search,
  Filter,
  MapPin,
} from "lucide-react";

const RequestForAdvocate = () => {
  const [request, setRequest] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const requestFor = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await UseAxios("/request-for-advocate/advocate");
      const allMessages = response?.data?.messages || [];

      // Filter only messages where advocateId matches the logged-in advocate

      setRequest(allMessages);
      setLoading(false);
    } catch {
      toast.warning("Failed to refresh messages");
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await UseAxios(`/request-service/accepted/${id}`, {
        method: "PATCH",
        data: { status: true },
      });

      toast.success("Message accepted");

      if (response?.ok) {
        const acceptedRequest = request.find((r) => r._id === id);

        const caseFileData = {
          title: acceptedRequest?.userMessage?.issueType || "Untitled",
          client_name: acceptedRequest?.userMessage?.name,
          client_id: acceptedRequest.clientId,
          advocate_id: acceptedRequest.forwardedTo,
          case_type: "General", // or dynamic if available
          court_name: "Unknown Court", // if not available
          summary: acceptedRequest?.userMessage?.message || "",
          parties: {
            plaintiff: {
              name: acceptedRequest?.userMessage?.name,
              contact: acceptedRequest?.userMessage?.phone,
            },
            defendant: {
              name: "Unknown", // or placeholder
              contact: "",
            },
          },
          related_laws: [],
        };

        await UseAxios("/showOwnCaseFile/createCaseFile", {
          method: "POST",
          data: caseFileData,
        });
      }

      requestFor();
    } catch {
      // toast.error("Failed to accept message");
    }
  };

  const handleReject = async (id) => {
    try {
      await UseAxios(`/request-service/rejected/${id}`, {
        method: "PATCH",
      });
      toast.success("Message rejected");
      requestFor();
    } catch {
      // toast.error("Failed to reject message");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      sent_to_advocate: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return `text-xs px-3 py-1.5 rounded-full font-medium border ${
      styles[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      case "pending":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredRequests = request.filter((msg) => {
  const name = msg.userMessage?.name || "";
  const email = msg.userMessage?.email || "";
  const issueType = msg.userMessage?.issueType || "";

  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issueType.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || msg.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  const getUrgencyLevel = (createdDate) => {
    const daysDiff = Math.floor(
      (new Date() - new Date(createdDate)) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > 7) return "high";
    if (daysDiff > 3) return "medium";
    return "low";
  };

  useEffect(() => {
    requestFor();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold  mb-4">
            Legal Requests from admin
          </h1>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Requests",
              value: request.length,
              color: "indigo",
              icon: FileText,
            },
            {
              label: "Pending",
              value: request.filter((r) => r.status === "pending").length,
              color: "amber",
              icon: Clock,
            },
            {
              label: "Accepted",
              value: request.filter((r) => r.status === "accepted").length,
              color: "emerald",
              icon: CheckCircle,
            },
            {
              label: "Rejected",
              value: request.filter((r) => r.status === "rejected").length,
              color: "red",
              icon: XCircle,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 text-${stat.color}-500`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No requests found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-2">
            {filteredRequests.map((msg) => {
              const m = msg.userMessage;
              const urgency = getUrgencyLevel(msg.createdAt);
              const isPending =
                msg.status === "pending" || msg.status === "sent_to_advocate";

              return (
                <div
                  key={msg._id}
                  className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    urgency === "high"
                      ? "border-red-200 bg-red-50/30"
                      : urgency === "medium"
                      ? "border-amber-200 bg-amber-50/30"
                      : "border-gray-100"
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="text-white w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {m?.name}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 ${getStatusBadge(
                              msg.status
                            )}`}
                          >
                            {getStatusIcon(msg.status)}
                            {msg.status.charAt(0).toUpperCase() +
                              msg.status.slice(1).replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      {isPending && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(msg._id)}
                            disabled={loading}
                            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(msg._id)}
                            disabled={loading}
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                      {urgency === "high" && (
                        <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          Urgent
                        </div>
                      )}
                    </div>

                    {/* Specialization Badge */}
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      {m?.issueType}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="font-medium">Email:</span>
                        <span className="text-gray-600 truncate">
                          {m?.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">Phone:</span>
                        <span className="text-gray-600">{m?.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="font-medium">NID:</span>
                        <span className="text-gray-600 font-mono">
                          {m?.nid}
                        </span>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-3 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Present:</span>
                          <p className="text-gray-600 mt-1">
                            {m?.presentAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Permanent:</span>
                          <p className="text-gray-600 mt-1">
                            {m?.permanentAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="pt-2 border-t border-gray-100">
                      <span className="font-medium text-sm text-gray-700">
                        Message:
                      </span>
                      <p className="text-gray-600 mt-2 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                        {m?.message}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-4 h-4" />
                        {new Date(msg.createdAt).toLocaleString("en-BD", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestForAdvocate;
