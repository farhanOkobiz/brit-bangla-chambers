"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/api/apiFetch";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  //   const userId = searchParams.get('user');
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch(`/auth/verify-otp`, {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (!res.ok) {
        setError(res.data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      // OTP verified, cookies set, redirect to profile
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-gray-700 text-2xl font-bold mb-6 text-center">
          Verify OTP
        </h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          We’ve sent a one-time code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-md w-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md font-bold text-lg shadow-md hover:bg-gray-800 transition cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </section>
  );
}
