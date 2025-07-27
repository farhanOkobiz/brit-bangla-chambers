"use client";

export default function AboutBritBanglaChamber() {
  return (
    <section className="min-h-screen bg-gray-100 text-gray-800 py-16 px-6 md:px-12">
      <div className="mx-auto text-center mb-6 md:mb-8 lg:mb-12">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-5xl font-bold">
          Welcome to Brit Bangla Chamber
        </h2>
        <p className="mt-2 text-base md:text-lg text-center text-gray-600">
          We are a cross-border legal and consultancy firm bridging Bangladesh
          and the United Kingdom with trusted expertise in law, business, and
          immigration .
        </p>
      </div>

      {/* Mission, Vision, Services */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-600">
            To empower clients with legal clarity and business confidence
            through reliable, transparent, and result-driven consultancy
            services.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
          <p className="text-gray-600">
            To become the leading consultancy hub trusted by individuals and
            businesses across Bangladesh and the UK.
          </p>
        </div>

        {/* Services - Full width */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow hover:shadow-lg col-span-1 md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Core Services</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Legal Consultancy for Immigration & Visa</li>
            <li>Business & Corporate Law Advisory</li>
            <li>Investment & Trade Facilitation</li>
            <li>Notary & Documentation Services</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
