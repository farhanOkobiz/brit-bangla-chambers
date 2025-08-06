"use client";
import ResetForm from "@/components/Form/ResetForm";


export default function resetPage() {
  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 text-center">
          Reset password
        </h2>
        <ResetForm />
      </div>
    </section>
  )
}
