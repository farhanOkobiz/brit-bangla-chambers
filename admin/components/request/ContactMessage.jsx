import { useEffect, useState } from "react";
import { UseAxios } from "../../services/UseAxios";
import Swal from "sweetalert2";

function ContactMessage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const messagesPerPage = 9; // 3x3 grid

  useEffect(() => {
    const messageFun = async () => {
      setLoading(true);
      try {
        const res = await UseAxios("/contact/all-contact-message");
        setMessages(res.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        Swal.fire("Error", "Failed to load messages", "error");
      } finally {
        setLoading(false);
      }
    };
    messageFun();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );
  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent opening modal
    try {
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
        Swal.fire({
          title: "Deleting...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const res = await UseAxios(`/contact/delete-contact/${id}`, {
          method: "DELETE",
        });

        Swal.close();

        if (res.ok) {
          setMessages((prev) => prev.filter((msg) => msg._id !== id));
          Swal.fire("Deleted!", "The message has been deleted.", "success");
        } else {
          Swal.fire("Failed", "Failed to delete the message.", "error");
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error", "Something went wrong while deleting.", "error");
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contact Messages
                </h1>
                <p className="text-indigo-200 mt-2">
                  View and manage all incoming messages
                </p>
              </div>
              <div className="mt-4 sm:mt-0 bg-white/20 rounded-full px-4 py-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-white font-medium">
                  {messages.length} messages
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your inbox is empty. All new contact messages will appear
                  here.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer"
                      onClick={() => {
                        setSelectedMessage(msg);
                        setShowModal(true);
                      }}
                    >
                      <div className="p-5 flex-grow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
                              <span className="font-bold text-indigo-700">
                                {msg.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <h3 className="font-semibold text-gray-900 line-clamp-1">
                                {msg.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {formatDate(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex">
                            <a
                              href={`mailto:${msg.email}`}
                              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                              title="Reply via email"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              EMAIL
                            </p>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-blue-600 hover:text-blue-800 font-medium block truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {msg.email}
                            </a>
                          </div>

                          {msg.phone && (
                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                PHONE
                              </p>
                              <a
                                href={`tel:${msg.phone}`}
                                className="text-gray-700 font-medium truncate"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {msg.phone}
                              </a>
                            </div>
                          )}

                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              MESSAGE
                            </p>
                            <p className="text-gray-700 mt-1 line-clamp-3 break-words min-h-[60px]">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Fixed footer for all cards */}
                      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            {new Date(msg.createdAt).toLocaleString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </div>
                          <button
                            onClick={(e) => handleDelete(msg._id, e)}
                            className="flex items-center text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-6">
                    <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstMessage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastMessage, messages.length)}
                      </span>{" "}
                      of <span className="font-medium">{messages.length}</span>{" "}
                      messages
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message Details Modal - FIXED */}
      {showModal && selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Sender Info */}
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-indigo-700 text-lg">
                  {selectedMessage.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedMessage.name}
                </h3>
                <div className="mt-1 text-gray-600">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="mt-1 text-gray-600">
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="hover:text-blue-600"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="border-t border-gray-200 pt-5 flex-grow flex flex-col">
              <h2 className="text-lg font-bold mb-2">Subject</h2>
              <p className="mb-6 text-gray-700 font-medium">
                {selectedMessage.subject || "No subject"}
              </p>

              <h2 className="text-lg font-bold mb-2">Message</h2>
              <div className="bg-gray-50 rounded-lg p-4 flex-grow overflow-y-auto max-h-[50vh]">
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactMessage;
