"use client";

import ClientSignupForm from "@/components/Form/ClientSignupForm";
import Link from "next/link";

export default function SignUppage() {
  return (
    <section className="min-h-screen bg-gray-100 py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-4 md:p-8">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">
          Registration
        </h2>

        {/* Forms */}
        <ClientSignupForm />

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
