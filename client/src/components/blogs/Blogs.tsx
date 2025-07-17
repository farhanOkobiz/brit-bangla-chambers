import Link from "next/link";
import React from "react";

function Blogs() {
  return (
    <section
      className="relative py-16 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/blogs/blog.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/90 bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full px-4 mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700">
          our blog
        </h2>

        <p className="text-lg text-gray-300 mb-4 uppercase tracking-wider">
          <Link
            href="#"
            className="text-4xl md:text-5xl font-bold text-gray-900 transition duration-300 ease-in-out"
          >
            Recent Articles
          </Link>
        </p>

        <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Understanding Civil Law in Bangladesh",
              image:
                "https://cdn.pixabay.com/photo/2023/06/28/15/57/travel-8094686_640.jpg",
              author: "James Milner",
              createdAt: "2025-07-17",
            },
            {
              title: "Family Law: What You Should Know",
              image:
                "https://cdn.pixabay.com/photo/2012/03/04/01/01/father-22194_640.jpg",
              author: "Emma Bunton",
              createdAt: "2025-07-10",
            },
            {
              title: "Land Dispute Resolution Guide",
              image:
                "https://cdn.pixabay.com/photo/2020/03/12/20/10/right-4926156_640.jpg",
              author: "Melanie Brown",
              createdAt: "2025-06-30",
            },
          ].map((blog, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-gray-800">
                <p className="text-sm text-gray-500 mb-2">
                  By <span className="font-semibold">{blog.author}</span> ·{" "}
                  {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-xl font-semibold">{blog.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <button className="bg-[#5e3030] text-white mt-8 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer">
          Read The Blog
        </button>
      </div>
    </section>
  );
}

export default Blogs;
