import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useAxios } from "../../services/UseAxios";
=======
import { UseAxios } from "../../services/UseAxios";
>>>>>>> development
import Swal from "sweetalert2";

function ContactMessage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messageFun = async () => {
      const res = await UseAxios("/contact/all-contact-message");
      setMessages(res.data);
    };
    messageFun();
  }, []);

  const handleDelete = async (id) => {
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
        const res = await UseAxios(`/contact/delete-contact/${id}`, {
          method: "DELETE",
        });

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📨 All Contact Messages</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="border p-4 rounded-lg shadow bg-white">
            <p>
              <strong>Name:</strong> {msg.name}
            </p>
            <p>
              <strong>Email:</strong> {msg.email}
            </p>
            <p>
              <strong>Phone:</strong> {msg.phone}
            </p>
            <p>
              <strong>Message:</strong> {msg.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Sent on: {new Date(msg.createdAt).toLocaleString()}
            </p>
            <button
              onClick={() => handleDelete(msg._id)}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactMessage;
