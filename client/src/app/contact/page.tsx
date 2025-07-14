export default function ContactPage() {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-6 md:px-12 text-white">
        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Contact Us
            </span>
          </h1>
          <p className="text-gray-300 text-lg">
            Reach out for consultations, inquiries, or legal guidance. We’re here to help you.
          </p>
        </div>
  
        {/* Static Office Info */}
        <div className="max-w-3xl mx-auto mt-8 mb-14 bg-white/5 border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">📍 Our Office</h2>
          <div className="text-gray-300 text-center space-y-1">
            <p>Brit Bangla Chamber</p>
            <p>House #12, Road #5, Dhanmondi, Dhaka-1205, Bangladesh</p>
            <p>Email: contact@britbanglachamber.com</p>
            <p>Phone: +8801XXXXXXXXX</p>
          </div>
        </div>
  
        {/* Contact Form */}
        <div className="max-w-3xl mx-auto bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur">
          <form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 bg-slate-800 text-white border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
  
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-800 text-white border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
  
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 bg-slate-800 text-white border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
  
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Your Message</label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 bg-slate-800 text-white border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
  
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-md font-semibold transition shadow-md"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  