import React, { useEffect, useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import { CheckCircle, Trash2, Clock } from "lucide-react";
import { UseAuth } from "../../auth/AuthContext";

const HelpAndSupport = () => {
    const [data, setData] = useState([]);
      const { role } = UseAuth()

    const fetchData = async () => {
        try {
            const response = await UseAxios("/support", { method: "GET" });
            setData(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching help and support data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChangeStatus = async (id) => {
        try {
            await UseAxios(`/support/${id}/status`, {
                method: "PUT",
                data: { status: "resolved" },
            });
            fetchData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await UseAxios(`/support/${id}`, { method: "DELETE" });
            fetchData();
        } catch (error) {
            console.error("Error deleting request:", error);
        }
    };

    const pendingRequests = data.filter((r) => r.status === "pending");
    const resolvedRequests = data.filter((r) => r.status === "resolved");

    return (
        <div className="max-w-8xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-gray-600 mb-6">Manage user support requests efficiently.</p>

            {pendingRequests.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-3 text-yellow-600">Pending Help Requests</h2>
                    <div className="space-y-4">
                        {pendingRequests.map((req) => (
                            <div key={req._id} className="bg-white border border-yellow-300 rounded-lg p-5 shadow-md">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{req.subject}</h3>
                                    <span className="flex items-center gap-1 text-sm text-yellow-600 font-medium bg-yellow-100 px-2 py-0.5 rounded">
                                        <Clock size={14} />
                                        Pending
                                    </span>
                                </div>
                                <p className="text-gray-700">{req.message}</p>
                                <p className="text-sm text-gray-500 mt-2">From: {req.userId?.full_name || "Unknown"}</p>
                                <button
                                    onClick={() => handleChangeStatus(req._id)}
                                    className="mt-4 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                                >
                                    <CheckCircle size={16} className="mr-2" />
                                    Mark as Resolved
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {resolvedRequests.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-3 text-green-600">Resolved Requests</h2>
                    <div className="space-y-4">
                        {resolvedRequests.map((req) => (
                            <div key={req._id} className="bg-gray-50 border border-gray-300 rounded-lg p-5 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{req.subject}</h3>
                                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded">
                                        <CheckCircle size={14} />
                                        Resolved
                                    </span>
                                </div>
                                <p className="text-gray-700">{req.message}</p>
                                <p className="text-sm text-gray-500 mt-2">From: {req.userId?.full_name || "Unknown"}</p>
                                { role === "admin" && (
                                <button
                                    onClick={() => handleDelete(req._id)}
                                    className="mt-4 inline-flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                                >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </button>
                                )}
                           
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {pendingRequests.length === 0 && resolvedRequests.length === 0 && (
                <div className="text-center text-gray-500 mt-10">No support requests found.</div>
            )}
        </div>
    );
};

export default HelpAndSupport;
