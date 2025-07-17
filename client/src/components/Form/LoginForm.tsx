"use client";

import { apiFetch } from "@/api/apiFetch";
import { useState } from "react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        body: JSON.stringify(form),
      });

if (!res.ok) {
  const data = res.data;
  // Check for custom OTP status code
  if (res.status === 470) {
    await apiFetch(`/auth/send-otp`, {
      method: "POST",
      body: JSON.stringify({ email: form.email }),
    });
    return router.push(`/verify-otp?user=${data?.userId}&email=${encodeURIComponent(data?.email)}`);
  } else {
    return setError(data?.message || "Login failed");
  }
}

      const data = res.data;
      const user = data.user;

      // Redirect based on user role
      if (user?.role === "client") {
        router.push("/client/dashboard");
      }
      else if (user?.role === "admin") {
        router.push("/unauthorized");
      } else if (user?.role === "advocate") {
        router.push("/unauthorized");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
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
          className="w-full bg-black text-white py-3 rounded-md font-bold text-lg shadow-md hover:bg-gray-800 transition cursor-pointer"
        >
          Login
        </button>
      </form>
    </>
  );
}

export default LoginForm;
