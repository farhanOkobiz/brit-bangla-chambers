"use client";

import Link from "next/link";
import Image from "next/image";

const servicesData = [
  {
    category: "Legal Aid",
    subcategory: "Criminal Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2023/12/10/19/08/judgment-8442199_640.png", // add image URL if available
    title: "Criminal Law",
    description: "Expert legal advice and representation for criminal cases.",
  },
  {
    category: "Legal Aid",
    subcategory: "Family Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2023/12/10/19/08/judgment-8442199_640.png", // add image URL if available
    title: "Family Law",
    description: "Support with divorce, child custody, and family disputes.",
  },
  {
    category: "Legal Aid",
    subcategory: "Property & Land Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2023/12/10/19/08/judgment-8442199_640.png", // add image URL if available
    title: "Property & Land Law",
    description:
      "Guidance on land disputes, registration, and property transfers.",
  },
  {
    category: "Legal Aid",
    subcategory: "Immigration & Visa",
    serviceImage:
      "https://cdn.pixabay.com/photo/2023/12/10/19/08/judgment-8442199_640.png", // add image URL if available
    title: "Immigration & Visa",
    description: "Visa processing, immigration advice and legal help.",
  },
  {
    category: "Legal Aid",
    subcategory: "Business Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2023/12/10/19/08/judgment-8442199_640.png", // add image URL if available
    title: "Business Law",
    description:
      "Legal consultation for startups, contracts, and business compliance.",
  },
];

export default function ServicesPage() {
  return (
    <section className="bg-gray-100 py-6 px-4 md:py-10 md:px-8 lg:py-16 lg:px-12 mx-auto">
      <div className="mx-auto text-center mb-6 md:mb-8 lg:mb-12">
        <h2 className="text-gray-700 text-2xl md:text-3xl lg:text-5xl font-bold">
          Our Services
        </h2>
        <p className="mt-2 text-base md:text-lg text-center text-gray-600">
          We provide a range of legal and consultancy services tailored to your
          needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {servicesData.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-300 shadow hover:shadow-lg transition"
          >
            <div className="mb-4 flex justify-center">
              <Image
                src={service.serviceImage}
                alt={service.title}
                width={64} // w-16 = 4rem = 64px
                height={64} // h-16 = 4rem = 64px
                className="object-cover rounded-md"
              />
            </div>

            {/* Category and Subcategory */}
            <p className="text-xs text-gray-500 text-center mb-1 uppercase tracking-wide">
              {service.category} &mdash; {service.subcategory}
            </p>

            <h3 className="text-lg text-gray-700 font-medium text-center">
              {service.title}
            </h3>
            <p className="text-sm text-gray-600 text-center mt-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
