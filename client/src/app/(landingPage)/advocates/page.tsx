// import Image from "next/image";

// const advocates = [
//   {
//     id: 1,
//     name: "Mohammad Rahman",
//     image:
//       "https://cdn.pixabay.com/photo/2020/03/18/15/42/right-4944546_640.jpg",
//     designation: "Senior Advocate, Supreme Court",
//     expertise: ["Criminal Law", "Family Law", "Civil Litigation"],
//     profileLink: "/advocates/rahman",
//   },
//   {
//     id: 2,
//     name: "Sharmin Akter",
//     image:
//       "https://cdn.pixabay.com/photo/2017/10/05/20/49/office-2820890_640.jpg",
//     designation: "Advocate, Dhaka Judge Court",
//     expertise: ["Immigration", "Property Law"],
//     profileLink: "/advocates/sharmin",
//   },
//   {
//     id: 3,
//     name: "Kamrul Hasan",
//     image:
//       "https://cdn.pixabay.com/photo/2020/03/18/15/43/right-4944550_640.jpg",
//     designation: "Advocate, Civil & Corporate",
//     expertise: ["Corporate Law", "Contract Disputes"],
//     profileLink: "/advocates/kamrul",
//   },
//   {
//     id: 4,
//     name: "Rokeya Sultana",
//     image:
//       "https://cdn.pixabay.com/photo/2022/04/10/16/41/lawyer-7123798_640.jpg",
//     designation: "Family Law Specialist",
//     expertise: ["Divorce", "Child Custody"],
//     profileLink: "/advocates/rokeya",
//   },
//   {
//     id: 5,
//     name: "Tanvir Ahmed",
//     image:
//       "https://cdn.pixabay.com/photo/2020/03/18/15/44/right-4944555_640.jpg",
//     designation: "Legal Advisor, UK Immigration",
//     expertise: ["UK Visa", "Asylum Cases"],
//     profileLink: "/advocates/tanvir",
//   },
//   {
//     id: 6,
//     name: "Nasima Khatun",
//     image:
//       "https://cdn.pixabay.com/photo/2022/08/14/01/46/lawyer-7384762_640.jpg",
//     designation: "Property Law Expert",
//     expertise: ["Land Dispute", "Real Estate"],
//     profileLink: "/advocates/nasima",
//   },
// ];

// export default function AllAdvocatesPage() {
//   return (
//     <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-6 md:px-12 text-white">
//       <div className="max-w-6xl mx-auto text-center mb-12">
//         <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
//             All Advocates
//           </span>
//         </h1>
//         <p className="text-gray-300 text-lg">
//           Browse our team of legal professionals and choose the right expert for
//           your case.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {advocates.map((advocate, i) => (
//           <div
//             key={i}
//             className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur hover:shadow-lg transition"
//           >
//             <Image
//               src={advocate.image}
//               alt={advocate.name}
//               fill
//               className="rounded-full border-4 border-purple-500 object-cover"
//             />
//             <h3 className="text-xl font-semibold text-center">
//               {advocate.name}
//             </h3>
//             <p className="text-sm text-purple-300 text-center">
//               {advocate.designation}
//             </p>
//             <ul className="mt-4 text-sm text-gray-300 list-disc list-inside">
//               {advocate.expertise.map((area, idx) => (
//                 <li key={idx}>{area}</li>
//               ))}
//             </ul>
//             <div className="mt-6 text-center">
//               <a
//                 href={`/advocates/${advocate.id}`}
//                 className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 px-5 py-2 rounded-md text-sm font-semibold"
//               >
//                 View Profile
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


const advocate = () => {
  return (
    <div>
      <h1>Advocate Profile Page</h1>
      {/* Content will go here */}
    </div>
  );
}

export default advocate;
