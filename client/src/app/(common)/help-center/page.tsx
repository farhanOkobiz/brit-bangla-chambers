"use client";

import { apiFetch } from "@/api/apiFetch";
import { useState } from "react";
import { toast } from "react-toastify";

const data = [
  {
    title: "⚖️ Legal Services We Offer",
    desc: "Overview of our practice areas including Family, Immigration, Civil, and Criminal Law.",
  },
  {
    title: "📅 Consultation Booking",
    desc: "How to book an advocate, schedule or reschedule appointments.",
  },
  {
    title: "📁 Required Documents",
    desc: "Documents needed for different legal services and how to submit them.",
  },
  {
    title: "🛂 UK Immigration Services",
    desc: "Guidance on visa categories, eligibility, and application support.",
  },
  {
    title: "💳 Fees & Payment Options",
    desc: "Details about consultation fees, legal service charges, and accepted payment methods.",
  },
  {
    title: "🔒 Client Confidentiality",
    desc: "Our commitment to protecting your data and maintaining confidentiality.",
  },
  {
    title: "👨‍⚖️ Meet Our Advocates",
    desc: "Learn more about our experienced legal team and their areas of expertise.",
  },
  {
    title: "📝 Case Process & Timeline",
    desc: "Understand how your case will proceed from consultation to resolution.",
  },
  {
    title: "📞 Contact & Support",
    desc: "How to reach our team, support hours, and available communication channels.",
  },
  {
    title: "📍 Office Locations & Hours",
    desc: "Find our office addresses, contact numbers, and working hours.",
  },
];

export default function HelpCenterPage() {
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
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <section className="bg-gray-100 min-h-screen py-16 px-6 md:px-12">
        <div className="mx-auto text-center mb-6 md:mb-8 lg:mb-12">
          <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-5xl font-bold">
            Help Center
          </h2>
          <p className="mt-2 text-base md:text-lg text-center text-gray-600">
            Find answers to common questions or reach out to our support team.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow transition hover:scale-[1.02]"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* contact us  */}
      <div
        className="relative flex items-center justify-center py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16"
        style={{
          backgroundImage:
            'url("https://cdn.pixabay.com/photo/2015/10/22/06/56/lawyers-1000803_640.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 rounded-lg shadow-xl max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-white text-4xl md:text-5xl font-bold font-serif tracking-wide mb-4">
              Contact Us
            </h2>
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
    </>
  );
}
