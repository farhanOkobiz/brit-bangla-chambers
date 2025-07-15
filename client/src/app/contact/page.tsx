'use client'
import { useState } from "react";

export default function ContactPage() {
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
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Send to backend API
  };

    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-6 md:px-12 text-white">
        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Contact Us
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Reach out for consultations, inquiries, or legal guidance. We’re here to help you.
          </p>
        </div>
  
        {/* Static Office Info */}
        <div className="max-w-3xl mx-auto mt-8 mb-14 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">📍 Our Office</h2>
          <div className="text-gray-300 text-center space-y-1">
            <p>Brit Bangla Chamber</p>
            <p>House #12, Road #5, Dhanmondi, Dhaka-1205, Bangladesh</p>
            <p>Email: contact@britbanglachamber.com</p>
            <p>Phone: +8801XXXXXXXXX</p>
          </div>
        </div>
  
        {/* Contact Form */}
        <div className="max-w-3xl mx-auto bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
            />
          </div>

          {/* Phone & NID */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="nid"
              placeholder="NID Card Number"
              value={form.nid}
              onChange={handleChange}
              required
              className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
            />
          </div>

          {/* Present & Permanent Address */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="presentAddress"
              placeholder="Present Address"
              value={form.presentAddress}
              onChange={handleChange}
              required
              className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="permanentAddress"
              placeholder="Permanent Address"
              value={form.permanentAddress}
              onChange={handleChange}
              required
              className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
            />
          </div>

          {/* Issue Type */}
          <select
            name="issueType"
            value={form.issueType}
            onChange={handleChange}
            required
            className="bg-purple-900 text-white border border-white/20 p-3 rounded-md w-full"
          >
            <option value="">Select Issue Type</option>
            <option value="criminal">Criminal</option>
            <option value="family">Family</option>
            <option value="property">Property</option>
            <option value="immigration">Immigration</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>


          {/* Issue Description */}
          <textarea
            name="message"
            rows={4}
            placeholder="Describe the Issue"
            value={form.message}
            onChange={handleChange}
            required
            className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
          ></textarea>

          {/* Date & Time */}
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="bg-purple-900 border border-white/20 p-3 rounded-md w-full text-white placeholder-gray-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 py-3 rounded-md font-bold text-lg shadow-lg transition"
          >
            Confirm Booking
          </button>
        </form>
        </div>
      </section>
    );
  }
  