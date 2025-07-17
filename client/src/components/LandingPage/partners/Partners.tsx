import Link from "next/link";
import React from "react";

const Partners: React.FC = () => {
  return (
    <section className="text-white py-16 px-4 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url("/images/partners/partner.jpg")' }} // Replace with your actual background image
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-2">Partners at Attorna</h2>
        <p className="text-lg text-gray-400 mb-12 uppercase tracking-wider">
          <Link
            href="#"
            className="hover:text-gray-200 transition duration-300 ease-in-out"
          >
            View All People
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Partner Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
            <img
              src="https://via.placeholder.com/400x400/D3D3D3/000000?text=James+Milner" // Replace with actual image URL
              alt="James Milner"
              className="w-full h-80 object-cover"
            />
            <div className="p-6 text-center text-gray-800">
              <h3 className="text-2xl font-semibold mb-1">James Milner</h3>
              <p className="text-gray-600 uppercase tracking-wide text-sm">
                Partner
              </p>
            </div>
          </div>

          {/* Partner Card 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
            <img
              src="https://via.placeholder.com/400x400/D3D3D3/000000?text=Emma+Bunton" // Replace with actual image URL
              alt="Emma Bunton"
              className="w-full h-80 object-cover"
            />
            <div className="p-6 text-center text-gray-800">
              <h3 className="text-2xl font-semibold mb-1">Emma Bunton</h3>
              <p className="text-gray-600 uppercase tracking-wide text-sm">
                Partner
              </p>
            </div>
          </div>

          {/* Partner Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
            <img
              src="https://via.placeholder.com/400x400/D3D3D3/000000?text=Melanie+Brown" // Replace with actual image URL
              alt="Melanie Brown"
              className="w-full h-80 object-cover"
            />
            <div className="p-6 text-center text-gray-800">
              <h3 className="text-2xl font-semibold mb-1">Melanie Brown</h3>
              <p className="text-gray-600 uppercase tracking-wide text-sm">
                Partner
              </p>
            </div>
          </div>
        </div>

        {/* Pagination/Navigation Arrows */}
        <div className="flex justify-center mt-12 space-x-4">
          <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out">
            &lt;
          </button>
          <button className="bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 transition duration-300 ease-in-out">
            &gt;
          </button>
        </div>
      </div>
      {/* "Activate Windows" text positioned at bottom right */}
      <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
        Activate Windows <br />
        <a href="#" className="underline hover:text-gray-300">
          Go to Settings to activate Windows.
        </a>
      </div>
    </section>
  );
};

export default Partners;
