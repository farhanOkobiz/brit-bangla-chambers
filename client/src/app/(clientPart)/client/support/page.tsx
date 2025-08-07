"use client";

import React, { useEffect, useState } from "react";
import {
  useCreateHelpRequestMutation,
  useGetMyHelpRequestsQuery,
} from "@/redux/api/helpRequestApi";

type HelpRequest = {
  _id: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function ClientSupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [createHelpRequest, { isLoading }] = useCreateHelpRequestMutation();
  const { data, isFetching } = useGetMyHelpRequestsQuery({});
  const [numberOfRequests, setNumberOfRequests] = useState(0);

  useEffect(() => {
    if (data?.data?.data) {
      setNumberOfRequests(data.data.data.length);
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (numberOfRequests >= 2) {
      setError("You have reached the maximum number of requests (2).");
      return;
    }

    setSuccess("");
    setError("");

    try {
      await createHelpRequest(form).unwrap();
      setSuccess("Your request has been submitted!");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      interface HelpRequestError {
        data?: {
          error?: string;
        };
      }

      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as HelpRequestError).data === "object" &&
        (err as HelpRequestError).data !== null &&
        "error" in ((err as HelpRequestError).data as object)
      ) {
        setError(
          (err as HelpRequestError).data?.error || "Failed to submit request."
        );
      } else {
        setError("Failed to submit request.");
      }
    }
  };

  const requests = data?.data?.data || data?.data || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Help & Support Center
      </h2>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 transition hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            Submit a Request
          </h3>

          <div className="space-y-5">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full py-3.5 rounded-xl font-medium transition-all ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Request"
            )}
          </button>

          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center font-medium flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
        </form>

        {/* Request History Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-6">
            My Requests History
          </h3>

          <div className="space-y-4">
            {isFetching ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : requests.length ? (
              requests.map((req: HelpRequest) => (
                <div
                  key={req._id}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 text-base">
                      {req.subject}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="text-gray-600 mb-3 text-sm line-clamp-2">
                    {req.message}
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 8v4l3 2" />
                      <path d="M12 6a9 9 0 100 18 9 9 0 000-18z" />
                    </svg>
                    {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No requests found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
