"use client";
import ResetNewPasswordForm from "@/components/Form/ResetNewPasswordForm";
import { Suspense } from "react";

export default function ResetNewPasswordPage() {
  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">
          Reset new password
        </h2>
         <Suspense fallback={<div>Loading...</div>}>
          <ResetNewPasswordForm />
        </Suspense>
      </div>
    </section>
  );
}
