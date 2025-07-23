// app/help-center/page.tsx

import Link from "next/link";

const data = [
  {
    title: "📅 Booking Consultations",
    desc: "How to book an advocate and reschedule appointments.",
  },
  {
    title: "📁 Required Documents",
    desc: "Know what documents you need to provide for each service.",
  },
  {
    title: "🛂 Immigration Support",
    desc: "Learn about UK visa categories and consultation process.",
  },
  {
    title: "📞 Contact & Support",
    desc: "How to reach our team for further assistance.",
  },
  {
    title: "💼 Business Setup",
    desc: "Understand how we help register businesses in the UK.",
  },
  {
    title: "💳 Payment & Fees",
    desc: "Information about consultation fees and payment methods.",
  },
];

export default function HelpCenterPage() {
  return (
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
            className="bg-white p-6 rounded-xl border border-gray-200 shadow hover:shadow-lg transition hover:scale-[1.02]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
