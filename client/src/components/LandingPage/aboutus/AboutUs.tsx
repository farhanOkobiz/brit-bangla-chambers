"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";

function AboutUs() {
  return (
    <section className="relative py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16">
      {/* Section Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About Us
        </h2>
        <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
        {/* Image */}
        <div className="flex justify-center items-center ">
          <Image
            src="/images/aboutus/aboutus.jpg"
            alt="Legal Professional"
            width={640}
            height={427} // aspect ratio maintain korun
            className="rounded-lg shadow-xl object-cover"
          />
        </div>
        {/* What We Do */}
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-6">What We Do</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            We are committed to delivering high-quality legal services and
            ensuring client satisfaction. Our firm offers a wide range of legal
            assistance to empower and protect your rights.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            With years of experience and a team of dedicated professionals, we
            help navigate through legal complexities with ease.
          </p>

          <ul className="space-y-3 text-gray-700">
            {[
              "Expert legal consultation",
              "Strong case representation",
              "Trusted by 500+ clients",
              "Client-focused approach",
              "Transparent legal process",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon
                  fontSize="small"
                  className="text-[#3c2c2c] mr-2 mt-0.5"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
