import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../../services/useAxios";
import Swal from "sweetalert2";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";

const AdvocateMessage = () => {
  const [messages, setMessages] = useState([]);

  const refreshMessages = async () => {
    try {
      const response = await useAxios("/advocate-message");
      setMessages(response.data.messages || []);
    } catch {
      toast.warning("Failed to refresh messages");
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await useAxios(`/advocate-message/accepted/${id}`, {
        method: "PATCH",
        data: { status: true },
      });
      response.ok
        ? toast.success("Message accepted")
        : toast.error("Failed to accept message");
      refreshMessages();
    } catch {
      toast.error("Failed to accept message");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await useAxios(`/advocate-message/rejected/${id}`, {
        method: "PATCH",
      });
      response.ok
        ? toast.success("Message rejected")
        : toast.error("Failed to reject message");
      refreshMessages();
    } catch {
      toast.error("Failed to reject message");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the message.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await useAxios(`/advocate-message/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setMessages((prev) => prev.filter((msg) => msg._id !== id));
          await Swal.fire("Deleted!", "Message has been deleted.", "success");
        } else {
          await Swal.fire("Error", "Failed to delete message", "error");
        }
      } catch {
        await Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  useEffect(() => {
    refreshMessages();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center text-[#5e3030] mb-12">
        Advocate Messages 📩
      </h2>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No messages found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {messages.map((msg) => {
            const m = msg.userMessage;

            return (
              <div
                key={msg._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="text-indigo-500 w-5 h-5" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {m?.name}
                    </h3>
                  </div>

                  {msg.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(msg._id)}
                        className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(msg._id)}
                        className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full cursor-pointer"
                      >
                        <XCircle className="w-4 h-4 inline mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        msg.status === "accepted"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <Mail className="inline w-4 h-4 mr-1 text-gray-500" />{" "}
                    <strong>Email:</strong> {m?.email}
                  </p>
                  <p>
                    <Phone className="inline w-4 h-4 mr-1 text-gray-500" />{" "}
                    <strong>Phone:</strong> {m?.phone}
                  </p>
                  <p>
                    <strong>NID:</strong> {m?.nid}
                  </p>
                  <p>
                    <strong>Present Address:</strong> {m?.presentAddress}
                  </p>
                  <p>
                    <strong>Permanent Address:</strong> {m?.permanentAddress}
                  </p>
                  <p>
                    <strong>Issue Type:</strong> {m?.issueType}
                  </p>
                  <p>
                    <strong>Message:</strong> {m?.message}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(msg.createdAt).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-red-600 hover:text-red-800 transition cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdvocateMessage;
