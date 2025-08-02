"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/api/apiFetch";

function VerifyOtpPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
  const ADVOCATE_URL = process.env.NEXT_PUBLIC_ADVOCATE_URL;

  // Countdown for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch(`/auth/verify-otp`, {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        setError(res.data.message || "OTP verification failed");
        setLoading(false);
        return;
      }

      const data = res.data;
      const user = data.user;

      if (user?.role === "client") {
        router.push("/client/dashboard");
      } else if (user?.role === "admin" || user?.role === "advocate") {
        const targetUrl =
          user.role === "admin"
            ? `${ADMIN_URL}/admin/dashboard`
            : `${ADVOCATE_URL}/advocate/dashboard`;
        window.location.href = targetUrl;
      } else {
        setError("Invalid user role");
      }
    } catch {
      setError(
        "Something went wrong during verification, Try again through login"
      );
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setError(res.data.message || "Failed to resend OTP");
      } else {
        setResendCooldown(30);
      }
    } catch {
      setError("Something went wrong while resending");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-gray-700 text-2xl font-bold mb-4 text-center">
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
            className="w-full bg-black text-white py-3 rounded-md font-bold text-lg shadow-md hover:bg-gray-800 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendLoading}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {resendLoading
              ? "Resending..."
              : resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyOtpPageInner />
    </Suspense>
  );
}
