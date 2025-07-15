"use client";

import { Briefcase, Scale, Globe, Building, Users } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: <Scale size={28} />,
    title: "Criminal Law",
    description: "Expert legal advice and representation for criminal cases.",
  },
  {
    icon: <Users size={28} />,
    title: "Family Law",
    description: "Support with divorce, child custody, and family disputes.",
  },
  {
    icon: <Building size={28} />,
    title: "Property & Land Law",
    description:
      "Guidance on land disputes, registration, and property transfers.",
  },
  {
    icon: <Globe size={28} />,
    title: "Immigration & Visa",
    description: "Visa processing, immigration advice and legal help.",
  },
  {
    icon: <Briefcase size={28} />,
    title: "Business Law",
    description:
      "Legal consultation for startups, contracts, and business compliance.",
  },
];

export default function ServicesPage() {
  return (
    <section className="bg-gray-100 py-6 px-4 md:py-10 md:px-8 lg:py-16 lg:px-12 mx-auto">
      <div className="mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700">
            Services
          </span>
        </h2>
        <p className="text-gray-700 mt-2">
          We provide a range of legal and consultancy services tailored to your
          needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-300 shadow hover:shadow-lg transition"
          >
            <div className="mb-4 text-[#333] flex justify-center">
              {service.icon}
            </div>
            <h3 className="text-lg font-medium text-center">{service.title}</h3>
            <p className="text-sm text-gray-600 text-center mt-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link
          href="/contact"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition shadow-md"
        >
          Contact Support
        </Link>
      </div>
    </section>
  );
}
