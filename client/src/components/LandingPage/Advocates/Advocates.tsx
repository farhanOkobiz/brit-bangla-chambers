'use client';

import { Link } from "lucide-react";

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
    <section className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-6 md:px-12 text-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">
          Meet Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Advocates
          </span>
        </h2>
        <p className="text-gray-300 mt-2">Trusted legal professionals ready to help you.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {advocates.map((advocate, i) => (
          <div
            key={i}
            className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur hover:shadow-lg transition"
          >
            <img
              src={advocate.image}
              alt={advocate.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-purple-500 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-center">{advocate.name}</h3>
            <p className="text-sm text-purple-300 text-center">{advocate.designation}</p>
            <ul className="mt-4 text-sm text-gray-300 list-disc list-inside">
              {advocate.expertise.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
            <div className="mt-6 text-center">
            <a
            href={`/advocates/${advocate.id}`}
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 px-5 py-2 rounded-md text-sm font-semibold"
            >
            View Profile
            </a>
            </div>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="text-center mt-16">
        <a
          href="/advocates"
          className="inline-block px-6 py-3 rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 font-semibold transition shadow-md"
        >
          See All Advocates
        </a>
      </div>
    </section>
  );
}
