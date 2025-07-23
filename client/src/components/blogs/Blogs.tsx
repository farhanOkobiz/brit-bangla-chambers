"use client";
import { useGetBlogsQuery } from "@/redux/api/blogApi";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Blog } from "@/types/blog.interface";

function Blogs() {
  const { data: blogs } = useGetBlogsQuery(undefined);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  return (
    <section
      className="relative py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16 bg-gray-50 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/blogs/blog.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/90 bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 mx-auto text-center">
        <div className="text-center mb-14">
          <p className="text-lg text-gray-600 uppercase"> our blog </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recent Articles
          </h2>
          <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs?.data?.data.slice(0, 3).map((blog: Blog, idx: number) => (
            <Link
              href={`/blogs/${blog._id}`}
              key={idx}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out">
                <Image
                  src={`${imageUrl}${blog.image}`}
                  alt={blog.title}
                  width={800}
                  height={224}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 text-gray-800">
                  <p className="text-sm text-gray-500 mb-2">
                    By{" "}
                    <span className="font-semibold">{blog.author_model}</span> ·{" "}
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="text-xl font-semibold">{blog.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/blogs" className="inline-block">
          <button className="bg-[#5e3030] text-white mt-8 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer uppercase">
            Read The Blog
          </button>
        </Link>
      </div>
    </section>
  );
}

export default Blogs;
