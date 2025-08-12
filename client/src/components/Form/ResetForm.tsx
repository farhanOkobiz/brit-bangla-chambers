import { apiFetch } from "@/api/apiFetch";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "react-toastify";

function ResetForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch("/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Password reset request submitted successfully");
        setEmail("");
        router.push(`/resetNewPassword?email=${encodeURIComponent(email)}`);
      } else {
        toast.error("Failed to submit password reset request");
      }
    } catch {
      toast.error("Server error during reset request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-gray-300 p-3 rounded-md w-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center items-center gap-2 py-3 rounded-md font-bold text-lg shadow-md transition cursor-pointer
          ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 text-white"
          }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Send OTP"
        )}
      </button>
    </form>
  );
}

export default ResetForm;
