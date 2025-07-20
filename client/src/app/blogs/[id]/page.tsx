"use client";
import { useGetSingleBlogQuery } from "@/redux/api/blogApi";
import { useParams } from "next/navigation";
import React from "react";
import Image from "next/image";

function Page() {
  const { id } = useParams();
  const { data: blog } = useGetSingleBlogQuery(id);

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
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-700 uppercase">
          {blog?.data.data.title}
        </h2>
        {/* Author & Date */}
        <p className="text-sm text-gray-500 mb-2">
          By{" "}
          <span className="font-semibold">{blog?.data.data.author_model}</span>{" "}
          ·{" "}
          {new Date(blog?.data.data.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>

        {/* Cards Grid */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="max-w-4xl mx-auto">
              <Image
                src="https://cdn.pixabay.com/photo/2022/03/07/10/47/bird-7053394_640.jpg"
                alt={blog?.data.data.title || "Blog Image"}
                width={640} // ছবির আসল width
                height={224} // h-56 মানে 14rem ≈ 224px
                className="object-cover w-full"
              />
            </div>
            <div className="p-6 text-gray-800 max-w-4xl mx-auto">
              {/* Blog content */}
              <div
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.data.data.content }}
              />

              {/* Tags */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-2">Tags:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {blog?.data.data.tags.map((tag) => (
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
