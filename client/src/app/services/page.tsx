'use client';

import { Briefcase, Scale, Globe, Building, Users } from 'lucide-react';

const services = [
  {
    icon: <Scale size={32} />,
    title: 'Criminal Law',
    description: 'Expert legal advice and representation for criminal cases.',
  },
  {
    icon: <Users size={32} />,
    title: 'Family Law',
    description: 'Support with divorce, child custody, and family disputes.',
  },
  {
    icon: <Building size={32} />,
    title: 'Property & Land Law',
    description: 'Guidance on land disputes, registration, and property transfers.',
  },
  {
    icon: <Globe size={32} />,
    title: 'Immigration & Visa',
    description: 'Visa processing, immigration advice and legal help.',
  },
  {
    icon: <Briefcase size={32} />,
    title: 'Business Law',
    description: 'Legal consultation for startups, contracts, and business compliance.',
  },
];

export default function ServicesPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-300 mb-12">We provide a wide range of legal and consultancy services tailored to your needs.</p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div className="mb-4 text-purple-400">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
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
