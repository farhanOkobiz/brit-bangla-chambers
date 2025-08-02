"use client";
import { useGetSingleBlogQuery } from "@/redux/api/blogApi";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Blog } from "@/types/blog.interface";

function Page() {
  const { id } = useParams();
  const { data } = useGetSingleBlogQuery(id);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const blog: Blog = data?.data?.data;

  const fullImageUrl = blog?.image
    ? `${imageUrl?.endsWith("/") ? imageUrl.slice(0, -1) : imageUrl}/${
        blog.image.startsWith("/") ? blog.image.slice(1) : blog.image
      }`
    : "/fallback-image.png"; // fallback to some placeholder image or empty string

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
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700 uppercase">
          {blog?.title}
        </h2>
        {/* Author & Date */}
        <p className="text-sm text-gray-500 mb-2">
          By <span className="font-semibold">{blog?.author}</span> ·{" "}
          {new Date(blog?.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>

        {/* Cards Grid */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="max-w-7xl mx-auto">
              <Image
                src={fullImageUrl}
                alt={blog?.title || "Blog Image"}
                width={700}
                height={224}
                className="object-cover w-full"
              />
            </div>
            <div className="p-6 text-gray-800 max-w-4xl mx-auto">
              {/* Blog content */}
              <div
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.content }}
              />

              {/* Tags */}
              <div className="mt-6 flex gap-2 justify-center">
                <h4 className="font-semibold text-gray-700">Tags:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {blog?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
