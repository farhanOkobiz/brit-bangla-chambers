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

  const blog: Blog = data?.data?.data || {};

  const fullImageUrl = blog?.image
    ? `${imageUrl?.endsWith("/") ? imageUrl.slice(0, -1) : imageUrl}/${
        blog.image.startsWith("/") ? blog.image.slice(1) : blog.image
      }`
    : "/fallback-image.png"; // fallback to some placeholder image or empty string

  if (!blog) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl text-gray-600 font-semibold">Loading blog...</p>
      </section>
    );
  }

  return (
    <section
      className="relative py-2 md:p-10 bg-center bg-cover overflow-hidden text-white flex items-center justify-center mt-4"
      style={{
        backgroundImage: `url('/images/blogs/blog.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-white/90 bg-opacity-60" />

      <div className="relative z-10 w-full px-4 mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden text-left p-6 text-gray-800">
          {/* Floating image */}
          <Image
            src={fullImageUrl}
            alt={blog?.title || "Blog Image"}
            width={700}
            height={224}
            className=" float-none md:float-right w-full sm:w-[300px] md:w-[300px] lg:w-[400px] ml-4 mb-4 rounded shadow"
          />
          {/* Text wraps around the image */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700 uppercase">
            {blog.title}
          </h2>
          <div
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl text-justify"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          {/* Author and Date */}
          <p className="text-gray-500 mb-2 mt-4 clear-both">
            By <span className="font-semibold">{blog.author}</span>
            {new Date(blog.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {/* Tags */}
          <div className="mt-2 flex gap-2 items-center flex-wrap">
            <h4 className="font-semibold text-gray-700">Tags:</h4>
            {blog.tags?.length > 0 ? (
              blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 rounded-full text-gray-600 px-2 py-1 text-sm"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p>No tags available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;
