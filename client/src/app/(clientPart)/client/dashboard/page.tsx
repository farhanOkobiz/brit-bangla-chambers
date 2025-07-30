"use client";
import { apiFetch } from "@/api/apiFetch";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
} from "@/redux/api/notificationApi";
import { useGetAuthQuery } from "@/redux/api/authApi";
import { Bell } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Note {
  _id: string;
  title: string;
  message: string;
  case_number: string;
  createdAt: Date;
}

interface HearingVerdictDate {
  next_hearing_date?: string | null;
  verdict_date?: string | null;
}

interface ApiResponse {
  success: boolean;
  totalCases: number;
  hearingAndVerdictDates: HearingVerdictDate[];
}

export default function ClientDashboard() {
  const { data: user } = useGetAuthQuery(undefined);
  const userId = user?.data?.userId;
  const [data, setData] = useState<ApiResponse | null>(null);
  const router = useRouter();
  const { data: notifications } = useGetNotificationsQuery(userId, {
    skip: !user?.data?.userId,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteNotification(id).unwrap();

        Swal.fire("Deleted!", "Your notification has been deleted.", "success");

        closeModal();
      } catch {
        Swal.fire("Error!", "Failed to delete notification.", "error");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          "/client-dashboard/some-info-form-case"
        );
        console.log("Dashboard data:", response.data);
        setData(response?.data ?? null);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast.error("Failed to load dashboard data: ");
      }
    };

    fetchData();
  }, []);
  const handleClickEvent = () => {
    router.push("/client/file-request");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between px-4 md:px-8">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">
                  Client Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Welcome back, John!</p>
              </div>
              <div className=" flex justify-between items-center gap-4 bg-white shadow-md rounded-md p-6 max-w-sm mx-auto my-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Total Cases
                </h2>
                <p className="text-4xl font-bold text-blue-600">
                  {data?.totalCases || 0}
                </p>
              </div>
              <div className="">
                <button
                  type="button"
                  onClick={openModal}
                  className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <Bell className="w-5 h-5" />
                    </div>
                    <span className="text-gray-800 font-medium text-base">
                      Notifications
                    </span>
                  </div>

                  <span className="bg-red-500 text-white text-lg font-semibold m-2 rounded-full w-8 h-8 flex items-center justify-center">
                    {notifications?.data?.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Hearing and Verdict Dates
          </h2>

          {!data ||
          !data.hearingAndVerdictDates ||
          data.hearingAndVerdictDates.length === 0 ? (
            <p className="text-gray-500 italic">
              No hearing or verdict dates available.
            </p>
          ) : (
            <div className="space-y-2 md:space-y-4">
              {data.hearingAndVerdictDates.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide mb-1">
                      Next Hearing Date
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {item.next_hearing_date
                        ? dayjs(item.next_hearing_date).format("DD MMM YYYY")
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-semibold tracking-wide mb-1">
                      Verdict Date
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {item.verdict_date
                        ? dayjs(item.verdict_date).format("DD MMM YYYY")
                        : "Not set"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full mx-4 p-0 relative overflow-hidden border border-white/20 animate-in slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content Area */}
            <div className="p-8">
              {notifications?.data?.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-50">
                  {notifications.data.map((note: Note, index: number) => (
                    <li
                      key={note._id}
                      className="group bg-gradient-to-br from-white via-gray-50/50 to-white rounded-2xl p-6 shadow-lg hover:shadow-md transition-all duration-500 border border-gray-100/50 hover:border-purple-200 transform relative overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Background decoration */}
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 font-mono bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1.5 rounded-full border shadow-sm">
                            #{note.case_number}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="group/btn text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border-2 border-red-200 hover:border-red-500 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                          aria-label="Delete notification "
                        >
                          <span className="group-hover/btn:hidden">🗑️</span>
                          <span className="hidden group-hover/btn:inline">
                            Delete
                          </span>
                        </button>
                      </div>

                      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-3 leading-tight transition-all duration-500">
                        {note.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-5 text-base group-hover:text-gray-700 transition-colors duration-300">
                        {note.message}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            className="w-3 h-3 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold">
                          {new Date(note.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-xl font-semibold">
                    No notifications found
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    You are all caught up! 🎉
                  </p>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <button
                  onClick={closeModal}
                  className="group relative overflow-hidden rounded-2xl px-12 py-4 font-black text-lg bg-blue-600 text-white shadow-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer"
                >
                  <span className="relative z-10">Close</span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
