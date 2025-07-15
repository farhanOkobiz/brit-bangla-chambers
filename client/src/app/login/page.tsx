"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in user: ${form.email}`);
    // TODO: Send login request to backend
  };

  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login
        </h1>

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

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md font-bold text-lg shadow-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </section>
  );
}
