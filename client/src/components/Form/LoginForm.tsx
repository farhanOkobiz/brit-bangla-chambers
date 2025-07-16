"use client";

import { apiFetch } from "@/api/apiFetch";
import { useState } from "react";

function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in user: ${form.email}`);

    const res = await apiFetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(form),
    });
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
