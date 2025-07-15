export default function AboutBritBanglaChamber() {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 px-6 md:px-12 border border-white/10 ">
        <div className="max-w-5xl mx-auto text-center">
          {/* Gradient Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Brit Bangla Chamber
            </span>
          </h1>
  
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
            We are a cross-border legal and consultancy firm bridging Bangladesh
            and the United Kingdom with trusted expertise in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-semibold">
              law, business, and immigration
            </span>
            .
          </p>
        </div>
  
        {/* Main Content */}
        <div className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-2 text-white">Our Mission</h2>
            <p className="text-gray-300">
              To empower clients with legal clarity and business confidence through
              reliable, transparent, and result-driven consultancy services.
            </p>
          </div>
  
          {/* Vision */}
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-2 text-white">Our Vision</h2>
            <p className="text-gray-300">
              To become the leading consultancy hub trusted by individuals and
              businesses across Bangladesh and the UK.
            </p>
          </div>
  
          {/* Services */}
          <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur col-span-1 md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-white">Core Services</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>Legal Consultancy for Immigration & Visa</li>
              <li>Business & Corporate Law Advisory</li>
              <li>Investment & Trade Facilitation</li>
              <li>Notary & Documentation Services</li>
            </ul>
          </div>
        </div>
  
        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition shadow-md"
          >
            Contact Us for a Consultation
          </a>
        </div>
      </section>
    );
  }
  