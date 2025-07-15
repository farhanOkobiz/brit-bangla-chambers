"use client";

import ContactForm from "@/components/Form/ContactForm";
import { useState } from "react";

export default function ContactPage() {
  return (
    <section className="min-h-screen py-16 px-6 md:px-12 bg-gray-100">
      {/* Title */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">
          Reach out for consultations, inquiries, or legal guidance. We’re here
          to help.
        </p>
      </div>

      {/* Static Office Info */}
      <div className="max-w-3xl mx-auto mt-8 mb-14 bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          📍 Our Office
        </h2>
        <div className="text-gray-600 text-center space-y-1 text-sm">
          <p>Brit Bangla Chamber</p>
          <p>House #12, Road #5, Dhanmondi, Dhaka-1205, Bangladesh</p>
          <p>Email: contact@britbanglachamber.com</p>
          <p>Phone: +8801XXXXXXXXX</p>
        </div>
      </div>

      {/* Contact Form */}

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow">
        <ContactForm />
      </div>
    </section>
  );
}
