import { notFound } from 'next/navigation';

// Dummy advocate data (replace with real DB/API)
const advocates = [
  {
    id: 1,
    name: 'Mohammad Rahman',
    image: 'https://cdn.pixabay.com/photo/2022/08/14/01/46/lawyer-7384762_640.jpg',
    designation: 'Senior Advocate, Supreme Court',
    expertise: [
      'Criminal Law',
      'Family Law',
      'Civil Litigation',
      'Corporate & Business Law',
      'Land / Property Law',
      'Immigration & Visa',
      'Labor Law',
    ],
    experience: '15+ years',
    qualifications: ['LL.B, University of Dhaka (2008)'],
    memberships: [
      'Bangladesh Bar Council',
      'Dhaka Bar Association',
      'Supreme Court Bar Association',
    ],
    about:
      'Advocate Mohammad Rahman has over 15 years of experience providing legal services in civil and criminal litigation. Dedicated to justice and client satisfaction.',
    contactEmail: 'rahman@example.com',
    contactPhone: '01XXXXXXXXX',
    officeAddress: 'House 123, Road 5, Dhanmondi, Dhaka',
    availableHours: 'Mon-Fri: 10:00 AM - 5:00 PM',
    whatsappLink: 'https://wa.me/8801XXXXXXXXX',
    languages: ['Bangla', 'English', 'Hindi/Urdu'],
    clientReviews: [
      { rating: 5, comment: 'Very professional and helpful.' },
      { rating: 4, comment: 'Resolved my case efficiently.' },
    ],
    caseHistory: [
      'Successfully handled 200+ criminal cases',
      'Won landmark land dispute worth 10 crore BDT',
    ],
    bookingLink: '/booking/rahman', // Link to booking page/form
  },
  // Add more advocates here...
];

interface ClientReview {
  rating: number;
  comment: string;
}

interface Advocate {
  id: number;
  name: string;
  image: string;
  designation: string;
  expertise: string[];
  experience: string;
  qualifications: string[];
  memberships: string[];
  about: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  availableHours: string;
  whatsappLink: string;
  languages: string[];
  clientReviews: ClientReview[];
  caseHistory: string[];
  bookingLink: string;
}

interface Props {
  params: {
    id: string;
  };
}

export default function AdvocateProfilePage({ params }: Props) {
  const id = Number(params.id)
  const advocate: Advocate | undefined = advocates.find(a => a.id === id);

  if (!advocate) {
    notFound();
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6 md:px-12 text-white mx-auto">
      <div className="bg-white/5 rounded-xl p-8 border border-white/10 backdrop-blur shadow-lg mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <img
            src={advocate.image}
            alt={advocate.name}
            className="w-48 h-48 rounded-full border-4 border-purple-500 object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold">{advocate.name}</h1>
            <p className="text-purple-300 mt-1">{advocate.designation}</p>
            <p className="mt-2 text-gray-300">{advocate.experience} experience</p>
          </div>
        </div>

        {/* About */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">About</h2>
          <p className="text-gray-300">{advocate.about}</p>
        </section>

        {/* Practice Areas */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Practice Areas</h2>
          <ul className="list-disc list-inside text-gray-300">
            {advocate.expertise.map((area, i) => (
              <li key={i}>{area}</li>
            ))}
          </ul>
        </section>

        {/* Qualifications */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Qualifications</h2>
          <ul className="list-disc list-inside text-gray-300">
            {advocate.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        {/* Memberships */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Bar Memberships</h2>
          <ul className="list-disc list-inside text-gray-300">
            {advocate.memberships.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>

        {/* Languages Spoken */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Languages Spoken</h2>
          <ul className="list-disc list-inside text-gray-300">
            {advocate.languages.map((lang, i) => (
              <li key={i}>{lang}</li>
            ))}
          </ul>
        </section>

        {/* Case History / Success Stories */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Case History / Success Stories</h2>
          <ul className="list-disc list-inside text-gray-300">
            {advocate.caseHistory.map((caseItem, i) => (
              <li key={i}>{caseItem}</li>
            ))}
          </ul>
        </section>

        {/* Client Reviews & Ratings */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Client Reviews & Ratings</h2>
          <div className="space-y-4">
            {advocate.clientReviews.map((review, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-md">
                <p className="text-yellow-400">
                  {'⭐'.repeat(review.rating)}{' '}
                  <span className="text-gray-300">({review.rating} / 5)</span>
                </p>
                <p className="text-gray-300 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-purple-400">Contact</h2>
          <p>
            Email:{' '}
            <a href={`mailto:${advocate.contactEmail}`} className="underline text-purple-300">
              {advocate.contactEmail}
            </a>
          </p>
          <p>
            Phone:{' '}
            <a href={`tel:${advocate.contactPhone}`} className="underline text-purple-300">
              {advocate.contactPhone}
            </a>
          </p>
          <p>
            Office Address: <span className="text-gray-300">{advocate.officeAddress}</span>
          </p>
          <p>
            Available Hours: <span className="text-gray-300">{advocate.availableHours}</span>
          </p>
          <p>
            WhatsApp:{' '}
            <a
              href={advocate.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-purple-300"
            >
              Chat on WhatsApp
            </a>
          </p>
        </section>

        {/* Booking Button */}
        <div className="text-center">
          <a
            href={`/booking/${advocate.id}`}
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 px-8 py-3 rounded-md font-semibold transition shadow-md"
          >
            Book Now
          </a>
        </div>
      </div>
    </section>
  );
}
