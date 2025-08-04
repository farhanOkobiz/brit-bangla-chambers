"use client";

import { apiFetch } from "@/api/apiFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAuthQuery } from "@/redux/api/authApi";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data } = useGetAuthQuery(undefined);
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
  const ADVOCATE_URL = process.env.NEXT_PUBLIC_ADVOCATE_URL;

  useEffect(() => {
    if (data?.data && data.data.role === "client") {
      if(typeof window !== "undefined") {
        const storedPath = localStorage.getItem("client_prev_path");
        if (storedPath) {
          router.push(storedPath);
          localStorage.removeItem("client_prev_path");
        }
      }
    }
  }, [data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = res.data;
        if (res.status === 470) {
          await apiFetch(`/auth/send-otp`, {
            method: "POST",
            body: JSON.stringify({ email: form.email }),
          });
          router.push(
            `/verify-otp?user=${data?.userId}&email=${encodeURIComponent(
              data?.email
            )}`
          );
          return;
        } else {
          setError(data?.message || "Login failed");
          return;
        }
      }

      const data = res.data;
      const user = data.user;

      if (user?.role === "client") {
  let prevPath = "/";
  if (typeof window !== "undefined") {
    const storedPath = localStorage.getItem("client_prev_path");
    if (storedPath) {
      prevPath = storedPath;
      localStorage.removeItem("client_prev_path");
    }
    window.location.href = prevPath; // <-- Force full reload
  }
} else if (user?.role === "admin" || user?.role === "advocate") {
        const targetUrl =
          user.role === "admin"
            ? `${ADMIN_URL}/admin/dashboard`
            : `${ADVOCATE_URL}/advocate/dashboard`;
        window.location.href = targetUrl;
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
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
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
        className="border border-gray-300 p-3 rounded-md w-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <input
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="border border-gray-300 p-3 rounded-md w-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
      />

      {error && (
        <p className="text-red-600 text-sm font-medium text-center">{error}</p>
      )}

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
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}

export default LoginForm;
