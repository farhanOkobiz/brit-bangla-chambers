// app/help-center/page.tsx

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
]

export default function HelpCenterPage() {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Help Center
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Find answers to common questions or reach out to our support team.
          </p>
        </div>
  
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {data?.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur hover:scale-[1.02] transition"
            >
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
  
        <div className="text-center mt-16">
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 font-semibold transition shadow-md"
          >
            Contact Support
          </a>
        </div>
      </section>
    );
  }
  