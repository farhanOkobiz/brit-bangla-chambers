'use client';

import Link from "next/link";


const advocates = [
  {
    id: 1,
    name: "Mohammad Rahman",
    image: "https://cdn.pixabay.com/photo/2022/04/10/16/41/lawyer-7123798_640.jpg",
    designation: "Senior Advocate, Supreme Court",
    expertise: ["Criminal Law", "Family Law"],
    profileLink: "/advocates/rahman",
  },
  {
    id: 2,
    name: "Sharmin Akter",
    image: "https://cdn.pixabay.com/photo/2020/03/18/15/44/right-4944555_640.jpg",
    designation: "Advocate, Dhaka Judge Court",
    expertise: ["Immigration", "Property Law"],
    profileLink: "/advocates/sharmin",
  },
  {
    id: 3,
    name: "Kamrul Hasan",
    image: "https://cdn.pixabay.com/photo/2017/10/05/20/49/office-2820890_640.jpg",
    designation: "Advocate, Civil & Corporate",
    expertise: ["Corporate Law", "Contract Disputes"],
    profileLink: "/advocates/kamrul",
  },
];


export default function AdvocatesSection() {
  return (
<section className=" bg-gray-100 py-6 px-4 md:py-10 md:px-8 lg:py-16 lg:px-12 mx-auto">
  <div className="mx-auto text-center mb-12">
    <h2 className="text-4xl font-bold">
      Meet Our{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700">
        Advocates
      </span>
    </h2>
    <p className="text-gray-700 mt-2">Trusted legal professionals ready to help you.</p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {advocates.map((advocate, i) => (
      <div
        key={i}
        className="bg-white p-6 rounded-xl border border-gray-300 shadow hover:shadow-lg transition"
      >
        <img
          src={advocate.image}
          alt={advocate.name}
          className="w-32 h-32 mx-auto rounded-full border-4 border-black object-cover mb-4"
        />
        <h3 className="text-xl font-semibold text-center">{advocate.name}</h3>
        <p className="text-sm text-gray-600 text-center">{advocate.designation}</p>
        <ul className="mt-4 text-sm text-gray-700 list-disc list-inside">
          {advocate.expertise.map((area, idx) => (
            <li key={idx}>{area}</li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Link
            href={`/advocates/${advocate.id}`}
            className="inline-block px-6 py-3 rounded-lg font-semibold transition shadow-md"
          >
          View Profile

          </Link>
        </div>
      </div>
    ))}
  </div>

    <div className="text-center mt-8 md:mt-12 lg:mt-16">
      <Link
        href="/advocates"
        className="inline-block px-6 py-3 rounded-lg font-semibold transition shadow-md"
      >
        See All Advocates
      </Link>
    </div>
  </section>

  );
}
