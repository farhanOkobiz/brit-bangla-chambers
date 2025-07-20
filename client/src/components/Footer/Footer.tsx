import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1d1d1d] text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Brit Bangla Chamber</h2>
          <p className="text-gray-300">
            Bridging legal expertise between Britain and Bangladesh. We provide
            trusted legal consultancy and advocacy services.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/" className="hover:text-purple-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-purple-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/advocates"
                className="hover:text-purple-400 transition"
              >
                Advocates
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="hover:text-purple-400 transition"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-purple-400 transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-300">
            House 123, Road 5, Dhanmondi, Dhaka, Bangladesh
          </p>
          <p className="mt-2 text-gray-300">Phone: +880 1XXXXXXXXX</p>
          <p className="mt-1 text-gray-300">
            Email: info@britbanglachamber.com
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com/britbanglachamber"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              Facebook
            </Link>
            <Link
              href="https://twitter.com/britbanglachamber"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              Twitter
            </Link>
            <Link
              href="https://linkedin.com/company/britbanglachamber"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Brit Bangla Chamber. All rights
        reserved.
      </div>
    </footer>
  );
}
