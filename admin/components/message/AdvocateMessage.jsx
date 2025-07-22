import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAxios } from "../../services/useAxios";
import Swal from "sweetalert2";

const AdvocateMessage = () => {
  const [messages, setMessages] = useState([]);

  const handleAccept = async (id) => {
    try {
      const response = await useAxios(`/advocate-message/accepted/${id}`, {
        method: "PATCH",
        data: { status: true },
      });

      if (response.ok) {
        toast.success("Message accepted");
      } else {
        toast.error("Failed to accept message");
      }
    } catch (error) {
      toast.error("Failed to accept message");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await useAxios(`/advocate-message/rejected/${id}`, {
        method: "PATCH",
      });

      if (response.ok) {
        toast.success("Message rejected");
      } else {
        toast.error("Failed to reject message");
      }
    } catch {
      toast.error("Failed to reject message");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
      } catch (error) {
        await Swal.fire("Error", "Something went wrong!", "error");
      }
    }
  };

  useEffect(() => {
    const fetchAdvocateMessage = async () => {
      try {
        const response = await useAxios("/advocate-message");
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error(error);
        toast.warning("Failed to fetch advocate messages");
      }
    };

    fetchAdvocateMessage();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        Advocate Messages
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages found.</p>
        ) : (
          messages.map((msg) => {
            const m = msg.userMessage;

            return (
              <div
                key={msg._id}
                className="border shadow-md rounded-2xl p-6 transition bg-white border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-blue-600">{m?.name}</h2>
                  {msg.status === "pending" && (
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleAccept(msg._id)}
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(msg._id)}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {msg.status === "accepted" && (
                    <button
                      disabled
                      className="text-xs bg-green-300 text-green-800 px-3 py-1 rounded-full mt-2 cursor-not-allowed"
                    >
                      Accepted
                    </button>
                  )}

                  {msg.status === "rejected" && (
                    <button
                      disabled
                      className="text-xs bg-red-300 text-red-800 px-3 py-1 rounded-full mt-2 cursor-not-allowed"
                    >
                      Rejected
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Email:</strong> {m?.email}
                  </p>
                  <p>
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

                <p className="text-right text-xs text-gray-400 mt-4">
                  {new Date(msg.createdAt).toLocaleString("en-BD", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full hover:bg-red-200 hover:text-red-700 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdvocateMessage;
