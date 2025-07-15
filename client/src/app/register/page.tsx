'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    nid: '',
    presentAddress: '',
    permanentAddress: '',
    issueType: '',
    message: '',
    date: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Password and Confirm Password do not match!');
      return;
    }

    alert(`Registering user: ${form.name}`);
    // TODO: Send to backend
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg max-w-3xl w-full p-10 text-white">
        <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Your Full Name" value={form.name} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
            <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
          </div>

          {/* Phone & NID */}
          <div className="grid md:grid-cols-2 gap-6">
            <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
            <input type="text" name="nid" placeholder="NID Card Number" value={form.nid} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
          </div>

          {/* Present & Permanent Address */}
          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" name="presentAddress" placeholder="Present Address" value={form.presentAddress} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
            <input type="text" name="permanentAddress" placeholder="Permanent Address" value={form.permanentAddress} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
          </div>

          {/* Issue Type */}
          <select name="issueType" value={form.issueType} onChange={handleChange} required className="bg-purple-900 text-white border border-white/20 p-3 rounded-md w-full">
            <option value="">Select Issue Type</option>
            <option value="criminal">Criminal</option>
            <option value="family">Family</option>
            <option value="property">Property</option>
            <option value="immigration">Immigration</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>

          {/* Message */}
          <textarea name="message" rows={4} placeholder="Describe the Issue" value={form.message} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />

          {/* Date & Time */}
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />

          {/* Password & Confirm Password */}
          <div className="grid md:grid-cols-2 gap-6">
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400" />
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 py-3 rounded-md font-bold text-lg shadow-lg transition">
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-purple-400 hover:underline">Login here</a>
        </p>
      </div>
    </section>
  );
}
