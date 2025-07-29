import Link from "next/link";
import Image from "next/image";

interface ServiceCardProps {
  serviceImage: string;
  title: string;
  description: string;
}

const services = [
  {
    category: "Legal Aid",
    subcategory: "Family Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2024/04/06/17/58/ai-generated-8679746_640.jpg",
    title: "Divorce Filing Assistance",
    description:
      "Professional legal support for filing and managing divorce cases.",
  },
  {
    category: "Legal Aid",
    subcategory: "Criminal Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2024/04/06/17/58/ai-generated-8679746_640.jpg",
    title: "Criminal Defense Services",
    description:
      "Expert defense representation for individuals facing criminal charges.",
  },
  {
    category: "Legal Aid",
    subcategory: "Immigration Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2024/04/06/17/58/ai-generated-8679746_640.jpg",
    title: "Immigration Legal Support",
    description:
      "Guidance and representation for visa applications, asylum, and citizenship.",
  },
  {
    category: "Legal Aid",
    subcategory: "Business Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2024/04/06/17/58/ai-generated-8679746_640.jpg",
    title: "Business Formation Consulting",
    description:
      "Legal help for starting a business, including documentation and registration.",
  },
  {
    category: "Legal Aid",
    subcategory: "Property Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2024/04/06/17/58/ai-generated-8679746_640.jpg",
    title: "Property Dispute Resolution",
    description:
      "Assistance with property conflicts, land registry, and legal ownership.",
  },
  {
    category: "Legal Aid",
    subcategory: "Employment Law",
    serviceImage:
      "https://cdn.pixabay.com/photo/2024/04/06/17/58/ai-generated-8679746_640.jpg",
    title: "Workplace Rights Protection",
    description:
      "Support for employment disputes, unfair dismissal, and workplace harassment cases.",
  },
];

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceImage,
  title,
  description,
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center border-b-4 border-transparent hover:border-[#d69292] transition-colors duration-300">
      <div className="relative w-20 h-20 mb-6">
        <Image
          src={serviceImage}
          alt={title}
          fill
          className="object-cover rounded-full"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
        {description}
      </p>
      <Link
        href="#"
        className="text-[#d69292] font-semibold flex items-center group"
      >
        LEARN MORE
        <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
          &rarr;
        </span>
      </Link>
    </div>
  );
};

export function Services() {
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
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            serviceImage={service.serviceImage}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}
