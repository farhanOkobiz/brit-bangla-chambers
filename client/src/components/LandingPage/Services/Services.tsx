"use client";

import Image from "next/image";
import { useGetSpecializationQuery } from "@/redux/api/specializationApi";
import { useEffect, useState } from "react";

interface ServiceCardProps {
  name: string;
  image: string;
  details: string;
  link: string;
}



interface ServiceCardProps {
  name: string;
  image: string;
  details: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  image,
  details,
}) => {
  const [isOpen, setIsOpen] = useState(false); // ✅ only one modal state

  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center border-b-4 border-transparent hover:border-[#d69292] transition-colors duration-300">
        <div className="relative w-20 h-20 mb-6">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{name}</h3>

        {/* show only 5 lines */}
        <p className="text-gray-600 leading-relaxed mb-6 flex-grow line-clamp-5">
          {details}
        </p>

        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#5e3030] text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer"
        >
          Details
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl p-4 overflow-auto">
        <div className="bg-white rounded-lg p-6 lg:max-w-3/5 w-full shadow-lg max-h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">{name}</h2>
          <p className="text-gray-700 whitespace-pre-line">{details}</p>
          <div className="mt-6 text-right">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#5e3030] text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default ServiceCard;


export function Services() {
  const [services, setServices] = useState([]);
  const { data } = useGetSpecializationQuery(undefined);


  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  return (
    <section className="bg-gray-50 py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16">
      <div className="mx-auto mb-12 text-center">
        <div className="text-center mb-14">
          <p className="text-lg text-gray-600 uppercase">
            Legal Practices Area
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Legal Practices Area
          </h2>
          <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services?.map((service: ServiceCardProps, index) => (
          <ServiceCard
            key={index}
            name={service?.name}
            image={service?.image}
            details={service?.details}
            link={service?.link}
          />
        ))}
      </div>
    </section>
  );
}
