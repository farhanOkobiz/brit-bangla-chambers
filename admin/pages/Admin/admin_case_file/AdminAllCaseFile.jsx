import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaGavel,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { UseAxios } from "../../../services/UseAxios";
import { UseAuth } from "../../../auth/AuthContext";

function AdminAllCaseFile() {
  const [caseFiles, setCaseFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { role } = UseAuth()
  const base = role === "admin" ? "/admin" : "/staff";

  useEffect(() => {
    const fetchCaseFiles = async () => {
      try {
        const res = await UseAxios("/showOwnCaseFile/allCaseFile/for-admin");
        setCaseFiles(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching case files:", err);
        setError("Failed to load case files.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseFiles();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "closed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCases = caseFiles.filter((file) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || file.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl  md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Case Files Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Efficiently manage and track all your legal case files in one
            centralized location
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-2 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by case title, number, or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center p-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-center">
              Loading case files...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCases.length === 0 && (
          <div className="text-center py-16">
            <FaFileAlt className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No case files found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Stats Footer */}
        <div className=" bg-white rounded-2xl shadow-md p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-xl font-bold text-blue-600">
                {caseFiles.length}
              </div>
              <div className="text-gray-600">Total Cases</div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-amber-600">
                {caseFiles.filter((f) => f.status === "pending").length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-blue-600">
                {caseFiles.filter((f) => f.status === "in_progress").length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-emerald-600">
                {caseFiles.filter((f) => f.status === "closed").length}
              </div>
              <div className="text-gray-600">Closed</div>
            </div>
          </div>
        </div>

        {/* Case Files Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredCases.map((file) => (
            // <Link to={`/admin/detail-case-file/${file._id}`}>
            <div
              key={file._id}
              className=" bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 pb-6"
            >
              {/* Card Header */}
              <div className="p-6 relative">
                <div className="absolute  lg:top-6 right-4 flex items-center space-x-2  transition-opacity duration-200 ">
                  <Link
                    to={`${base}/detail-case-file/${file._id}`}
                    className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-700 rounded-lg transition-colors duration-200"
                    title="View Details"
                  >
                    <FaEye className="text-sm" />
                  </Link>
                  <Link
                    to={`${base}/edit-case-file/${file._id}`}
                    className="p-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-700 rounded-lg transition-colors duration-200"
                    title="Edit Case"
                  >
                    <FaEdit className="text-sm" />
                  </Link>
                </div>

                <div className="flex items-start gap-2">
                  <FaUser className="text-orange-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Client Name:</span>
                    <span className="font-medium text-gray-800 ml-1">
                      {file.client_name}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 mt-3 lg:mt-6 leading-tight">
                  {file.title || "Untitled Case"}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {file.case_number}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      file.status
                    )}`}
                  >
                    {file.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 space-y-4">
                {/* Key Information */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <FaGavel className="text-blue-500" />
                    <span className="text-gray-600"> Case type:</span>
                    <span className="font-medium text-gray-800">
                      {file.case_type || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-green-500" />
                    <span className="text-gray-600">Filed:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(file.filing_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Court and Client */}
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <FaGavel className="text-purple-500 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Court:</span>
                      <span className="font-medium text-gray-800 ml-1">
                        {file.court_name || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Hearing Date */}
                {file.next_hearing_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="text-blue-600" />
                    <span>Next Hearing:</span>
                    <span className="font-medium">
                      {new Date(file.next_hearing_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Verdict Date */}
                {file.verdict_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaGavel className="text-green-600" />
                    <span>Verdict Date:</span>
                    <span className="font-medium">
                      {new Date(file.verdict_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            // </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAllCaseFile;
