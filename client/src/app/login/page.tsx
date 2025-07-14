'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
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
    <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg max-w-md w-full p-10 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 py-3 rounded-md font-bold text-lg shadow-lg transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{' '}
          <a href="/register" className="text-purple-400 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </section>
  );
}
