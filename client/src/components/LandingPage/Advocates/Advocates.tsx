import Link from "next/link";
import React from "react";
import Image from "next/image";

const Advocates: React.FC = () => {
  return (
    <section
      className="relative py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/partners/partner.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90 bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto text-center">
        <p className="text-lg text-gray-300 uppercase tracking-wider">
          <Link
            href="#"
            className="text-[#754a49] transition duration-300 ease-in-out"
          >
            View All Advocates
          </Link>
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Advocates at Attorna
        </h2>
        <div className="w-24 h-1 bg-white mx-auto mb-10"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "James Milner", img: "James+Milner" },
            { name: "Emma Bunton", img: "Emma+Bunton" },
            { name: "Melanie Brown", img: "Melanie+Brown" },
          ].map((partner, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <div className="w-full h-[300px] relative rounded overflow-hidden">
                <Image
                  src="https://cdn.pixabay.com/photo/2022/04/10/16/41/lawyer-7123798_640.jpg"
                  alt={partner.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded"
                />
              </div>

              <div className="p-6 text-gray-800 text-center">
                <h3 className="text-2xl font-semibold mb-1">{partner.name}</h3>
                <p className="text-sm uppercase tracking-wider text-gray-600">
                  Advocate
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advocates;
