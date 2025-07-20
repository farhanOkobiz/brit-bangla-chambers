"use client";
import { apiFetch } from "@/api/apiFetch";
import React, { useState } from "react";
import { toast } from "react-toastify";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await apiFetch("/contact/create-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Message sent!");
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.error("Submission failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center p-4"
      style={{
        backgroundImage:
          'url("https://cdn.pixabay.com/photo/2015/10/22/06/56/lawyers-1000803_640.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 p-8 md:p-12 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl md:text-5xl font-serif tracking-wide mb-3">
            Contact Us
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name*"
              className="w-full p-4 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-[#5e3030] placeholder-gray-500 text-lg"
              required
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone*"
              className="w-full p-4 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-[#5e3030] placeholder-gray-500 text-lg"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email*"
            className="w-full p-4 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-[#5e3030] placeholder-gray-500 text-lg"
            required
          />

          <textarea
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            placeholder="Message*"
            className="w-full p-4 bg-white text-gray-900 rounded-md resize-y focus:ring-2 focus:ring-[#5e3030] placeholder-gray-500 text-lg"
            required
          ></textarea>

          <button
            type="submit"
            className="w-full bg-[#5e3030] text-white py-4 rounded-md text-xl font-semibold hover:bg-gray-200 hover:text-gray-900 transition duration-300 cursor-pointer"
          >
            SUBMIT NOW
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
