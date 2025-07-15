import Link from "next/link";
import { notFound } from "next/navigation";

// Dummy data placeholder: replace with real data fetch logic
const advocates = [
  {
    id: 1,
    name: "Mohammad Rahman",
    profile_photo_url:
      "https://cdn.pixabay.com/photo/2022/08/14/01/46/lawyer-7384762_640.jpg",
    designation: "Senior Advocate, Supreme Court",
    bar_council_enroll_num: "BSC-12345",
    experience_years: 12,
    bio: "Advocate Mohammad Rahman has over a decade of experience in criminal and civil litigation. Known for dedication and professionalism.",
    slug: "adv-mohammad-rahman",
    office_address: "House 123, Road 5, Dhanmondi, Dhaka",
    available_hours: {
      monday: "10:00–17:00",
      tuesday: "10:00–17:00",
      wednesday: "10:00–17:00",
      thursday: "10:00–17:00",
      friday: "10:00–17:00",
    },
    contact_links: {
      whatsapp: "https://wa.me/8801711223344",
      messenger: "https://m.me/adv.rahman",
    },
    social_links: {
      facebook: "https://facebook.com/adv.rahman",
      linkedin: "https://linkedin.com/in/adv-rahman",
    },
    languages: ["Bangla", "English", "Hindi/Urdu"],
    specialization: [
      "Criminal Law",
      "Family Law",
      "Civil Litigation",
      "Corporate & Business Law",
    ],
    education: [
      "LL.B, University of Dhaka (2012)",
      "LL.M, London School of Economics (2016)",
    ],
    certifications: [
      {
        _id: "cert1",
        title: "Cyber Law Certification",
        issuer: "BILIA",
        year: 2020,
      },
      {
        _id: "cert2",
        title: "Arbitration Training",
        issuer: "International Bar Association",
        year: 2021,
      },
    ],
    bar_memberships: [
      "Bangladesh Bar Council",
      "Dhaka Bar Association",
      "Supreme Court Bar Association",
    ],
    testimonials: [
      {
        _id: "t1",
        client_name: "Mr. Karim",
        comment: "Resolved my land issue quickly and professionally.",
        rating: 5,
        date: "2024-11-10",
      },
      {
        _id: "t2",
        client_name: "Mrs. Farzana",
        comment: "Very compassionate and knowledgeable in family matters.",
        rating: 4,
        date: "2025-03-05",
      },
    ],
    case_histories: [
      {
        _id: "c1",
        title: "Won High Profile Property Dispute",
        summary: "Represented client in a 10 crore land dispute and won.",
        is_confidential: false,
      },
      {
        _id: "c2",
        title: "Confidential Criminal Case",
        summary: "Details are confidential due to court restrictions.",
        is_confidential: true,
      },
    ],
    avg_rating: 4.8,
    total_reviews: 35,
    consultation_available: true,
    fee_structure: {
      base_fee: 1500,
      show_publicly: false,
    },
    status: "approved",
    featured: true,
    verified_by_admin: true,
  },
];

export default function AdvocateProfilePage({ params }) {
  const id = Number(params.id);
  const advocate = advocates.find((a) => a.id === id);

  if (!advocate) {
    notFound();
  }

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-6 md:px-12  mx-auto ">
      <div className=" bg-white rounded-xl p-4 md;p-6 lg:p-8 border border-white/20 backdrop-blur shadow-lg mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 lg:gap-8 mb-8">
          <div className="mx-auto md:mx-0">
            <img
              src={advocate.profile_photo_url}
              alt={advocate.name}
              className="w-48 h-48 rounded-full border-4 border-gray-700 object-cover"
            />
          </div>
          <div className="text-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {advocate.name}
            </h1>
            <p className="mt-1 ">{advocate.designation}</p>
            <p className="mt-2">
              Bar Council Enrollment: {advocate.bar_council_enroll_num}
            </p>
            <p className="mt-1">
              Experience: {advocate.experience_years} years
            </p>
          </div>
        </div>

        {/* About */}
        <section className="mb-8 text-gray-700">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">About</h2>
          <p className="">{advocate.bio}</p>
        </section>

        <div className=" grid grid-cols-1 lg:grid-cols-2">
          <div>
            {/* Practice Areas / Specializations */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Practice Areas
              </h2>
              <ul className="list-disc list-inside ">
                {advocate.specialization.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </section>
            {/* Bar Memberships */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Bar Memberships
              </h2>
              <ul className="list-disc list-inside ">
                {advocate.bar_memberships.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </section>
            {/* Case Histories */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Case Histories / Success Stories
              </h2>
              <ul className="list-disc list-inside ">
                {advocate.case_histories.map((caseItem) => (
                  <li key={caseItem._id}>
                    {caseItem.is_confidential ? (
                      <em>Confidential Case</em>
                    ) : (
                      <>
                        <strong>{caseItem.title}:</strong> {caseItem.summary}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>
            {/* Consultation & Fee */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Consultation & Fees
              </h2>
              <p className="">
                {advocate.consultation_available
                  ? `Consultations available. Base fee: ${advocate.fee_structure.base_fee} BDT`
                  : "Consultations currently not available."}
              </p>
              {advocate.fee_structure.show_publicly === false && (
                <p className=" italic text-sm">Fee not shown publicly</p>
              )}
            </section>
            {/* Contact Information */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Contact
              </h2>
              <p>
                Office Address:{" "}
                <span className="">{advocate.office_address}</span>
              </p>
              <p>
                Available Hours:
                <ul className="list-disc list-inside  ml-6">
                  {Object.entries(advocate.available_hours).map(
                    ([day, hours]) => (
                      <li key={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}: {hours}
                      </li>
                    )
                  )}
                </ul>
              </p>
              <p>
                WhatsApp:{" "}
                {advocate.contact_links.whatsapp ? (
                  <a
                    href={advocate.contact_links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                  >
                    Chat on WhatsApp
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                Messenger:{" "}
                {advocate.contact_links.messenger ? (
                  <a
                    href={advocate.contact_links.messenger}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                  >
                    Message on Messenger
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                Facebook:{" "}
                {advocate.social_links.facebook ? (
                  <a
                    href={advocate.social_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                  >
                    Facebook Profile
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                LinkedIn:{" "}
                {advocate.social_links.linkedin ? (
                  <a
                    href={advocate.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=""
                  >
                    LinkedIn Profile
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </section>
          </div>
          <div>
            {/* Education */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Education
              </h2>
              <ul className="list-disc list-inside ">
                {advocate.education.map((edu, i) => (
                  <li key={i}>{edu}</li>
                ))}
              </ul>
            </section>
            {/* Certifications */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Certifications
              </h2>
              <ul className="list-disc list-inside ">
                {advocate.certifications.map((cert) => (
                  <li key={cert._id}>
                    {cert.title} — {cert.issuer} ({cert.year})
                  </li>
                ))}
              </ul>
            </section>
            {/* Languages */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Languages Spoken
              </h2>
              <ul className="list-disc list-inside ">
                {advocate.languages.map((lang, i) => (
                  <li key={i}>{lang}</li>
                ))}
              </ul>
            </section>
            {/* Status & Verification */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Status
              </h2>
              <p className="capitalize">{advocate.status}</p>
              <p>
                Verified by Admin:{" "}
                <span>{advocate.verified_by_admin ? "Yes" : "No"}</span>
              </p>
              <p>
                Featured: <span>{advocate.featured ? "Yes" : "No"}</span>
              </p>
            </section>
            {/* Testimonials */}
            <section className="mb-8 text-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Client Testimonials
              </h2>
              <div className="space-y-4">
                {advocate.testimonials.map((t) => (
                  <div key={t._id} className="bg-white/10 p-4 rounded-md">
                    <p className="text-yellow-400">
                      {"⭐".repeat(t.rating)}{" "}
                      <span className="">({t.rating} / 5)</span>
                    </p>
                    <p className=" italic">"{t.comment}"</p>
                    <p className=" mt-1">
                      - {t.client_name}, {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Booking Button */}
        <div className="text-center mt-6 md:mt-8 lg:mt-12">
          <Link
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800"
          >
            Contact Us for a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
