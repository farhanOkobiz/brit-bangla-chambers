import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UseAxios } from "../../services/UseAxios";
import {
  FaCalendarAlt,
  FaEdit,
  FaGavel,
  FaRegFileAlt,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2";

function DetailsFile() {
  const { id } = useParams();
  const [file, setFile] = useState("");
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This case file will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // Optimistic update
      try {
        await useAxios(`/showOwnCaseFile/deleteCaseFile/${id}`, {
          method: "DELETE",
        });

        toast.success("Case file deleted successfully!");

        Swal.fire({
          title: "Deleted!",
          text: "Your case file has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/advocate/dashboard/all-case-file");
      } catch (error) {
        toast.error("Failed to delete the case file.");
      }
    }
  };

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await UseAxios(`/showOwnCaseFile/singleCaseFile/${id}`);
        const data = res.data?.data;
        setFile(data);
      } catch {
        toast.error("Failed to load case file.");
      }
    };

    fetchCase();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Case Files Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Efficiently manage and track all your legal case files in one
            centralized location
          </p>
        </div>

        {/* Case Files Grid */}
        <div className="mt-10">
          <div
            key={file._id}
            className=" bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 mt-4"
          >
            {/* Card Header */}
            <div className="p-6 relative">
              <div className="absolute lg:top-6 right-4 flex items-center space-x-2 transition-opacity duration-200">
                <Link
                  to={`/advocate/dashboard/request-file/${file?._id}`}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 rounded-lg transition-colors duration-200"
                >
                  <FaRegFileAlt className="text-sm" />
                </Link>

                <Link
                  to={`/advocate/dashboard/edit-case-file/${file?._id}`}
                  className="p-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-700 rounded-lg transition-colors duration-200"
                  title="Edit Case"
                >
                  <FaEdit className="text-sm" />
                </Link>
                <button
                  onClick={() => handleDelete(file?._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200 cursor-pointer"
                  title="Delete Case"
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 mt-12 leading-tight">
                {file?.title || "Untitled Case"}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{file?.case_number}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    file?.status
                  )}`}
                >
                  {file?.status?.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Key Information */}
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaGavel className="text-blue-500" />
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-800">
                    {file?.case_type || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-500" />
                  <span className="text-gray-600">Filed:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(file?.filing_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Court and Client */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <FaGavel className="text-purple-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Court:</span>
                    <span className="font-medium text-gray-800 ml-1">
                      {file?.court_name || "-"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaUser className="text-orange-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium text-gray-800 ml-1">
                      {file?.client_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parties */}
              {file.parties && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Parties Involved
                  </h4>
                  <div>
                    <span className="text-blue-600 font-medium">
                      Plaintiff:
                    </span>
                    <span className="text-gray-700 ml-1">
                      {file?.parties?.plaintiff?.name} (
                      {file?.parties?.plaintiff?.contact})
                    </span>
                  </div>
                  <div>
                    <span className="text-red-600 font-medium">Defendant:</span>
                    <span className="text-gray-700 ml-1">
                      {file?.parties?.defendant?.name} (
                      {file?.parties?.defendant?.contact})
                    </span>
                  </div>
                </div>
              )}

              {/* Summary */}
              {file.summary && (
                <div className="text-sm">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Case Summary
                  </h4>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">
                    {file?.summary}
                  </p>
                </div>
              )}

              {/* Next Hearing Date */}
              {file.next_hearing_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendarAlt className="text-blue-600" />
                  <span>Next Hearing:</span>
                  <span className="font-medium">
                    {new Date(file?.next_hearing_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Verdict Date */}
              {file.verdict_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaGavel className="text-green-600" />
                  <span>Verdict Date:</span>
                  <span className="font-medium">
                    {new Date(file?.verdict_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Judgment */}
              {file.judgment?.decision_summary && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Judgment
                  </h4>
                  <p className="text-green-700">
                    {file?.judgment?.decision_summary}
                  </p>
                  <p>
                    Decision Date:
                    {new Date(
                      file?.judgment?.decision_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsFile;
