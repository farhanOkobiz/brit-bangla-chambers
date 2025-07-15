"use client";

import AdvocateSignupForm from "@/components/Form/AdvocateSignupForm";
import ClientSignupForm from "@/components/Form/ClientSignupForm";
import Link from "next/link";
import { useState } from "react";

export default function SignUppage() {
  const [activeTab, setActiveTab] = useState<"client" | "advocate">("client");

  return (
    <section className="min-h-screen bg-gray-100 py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-4 md:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Choose Registration Type
        </h2>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("client")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "client"
                ? "bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setActiveTab("advocate")}
            className={`px-4 py-2 rounded-md font-medium ${
              activeTab === "advocate"
                ? "bg-black text-white rounded-md hover:bg-gray-800 transition cursor-pointer"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
            }`}
          >
            Advocate
          </button>
        </div>

        {/* Forms */}
        {activeTab === "client" ? <ClientSignupForm /> : <AdvocateSignupForm />}

        <p className="text-center text-gray-600 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </section>
  );
}
