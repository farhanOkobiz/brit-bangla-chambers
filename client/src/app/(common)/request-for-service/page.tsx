"use client";

import RequestServiceForm from "@/components/Form/RequestServiceForm";
import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("client_prev_path", "/request-for-service");
    }
  }, []);

  return (
    <section className="min-h-screen py-16 px-6 md:px-12 bg-gray-100">
      {/* Title */}
      <div className="mx-auto text-center mb-6 md:mb-8 lg:mb-12">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-5xl font-bold">
          Request for a service
        </h2>
        <p className="mt-2 text-base md:text-lg text-center text-gray-600">
          Reach out for consultations, inquiries, or legal guidance. We’re here
          to help.
        </p>
      </div>

      {/* Contact Form */}
      <div className="max-w-3xl mx-auto bg-white p-4 md:p-8 rounded-xl border border-gray-200 shadow">
        <RequestServiceForm />
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
    </section>
  );
}
