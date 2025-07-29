"use client";
import { apiFetch } from "@/api/apiFetch";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

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
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch(
          "/client-dashboard/some-info-form-case"
        );
        setData(response?.data ?? null);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Client Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back, John!</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white shadow-md rounded-md p-6 max-w-sm mx-auto my-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Total Cases
        </h2>
        <p className="text-4xl font-bold text-blue-600">
          {data?.totalCases || 0}
        </p>
      </div>

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
          <div className="">
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
  );
}
