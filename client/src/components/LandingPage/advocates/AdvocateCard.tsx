"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/api/apiFetch";
import { toast } from "react-toastify";
import { Advocate } from "@/types/advocate.interface";

const Advocates: React.FC = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const res = await apiFetch("/advocate/advocateByFeatured");
        setAdvocates(res.data);
      } catch {
        toast.error("Failed to fetch advocates");
      }
    };

    fetchAdvocates();
  }, []);

  return (
    <section
      className="relative py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16 bg-center bg-cover overflow-hidden text-white flex items-center justify-center"
      style={{
        backgroundImage: `url('/images/partners/partner.jpg')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/90 bg-opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto text-center">
        <p className="text-lg text-gray-300 uppercase tracking-wider">
          <Link
            href="/advocates"
            className="text-[#754a49] transition duration-300 ease-in-out"
          >
            View All Advocates
          </Link>
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Advocates at Attorna
        </h2>
        <div className="w-24 h-1 bg-white mx-auto mb-10"></div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advocates.length > 0 ? (
            advocates?.map((advocate, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col"
              >
                <div className="w-full h-[300px] relative rounded overflow-hidden">
                  <Image
                    src={`${imageUrl}/${advocate?.profile_photo_url?.replace(
                      /^\/+/,
                      ""
                    )}`}
                    alt="Profile of Advocate"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded"
                  />
                </div>

                {/* ✅ Flex layout ensures consistent height */}
                <div className="flex flex-col justify-between flex-1 p-6 text-gray-800 text-center">
                  <div>
                    <h3 className="text-2xl font-semibold mb-1">
                      {advocate?.user_id?.full_name}
                    </h3>
                    <p className="text-sm uppercase tracking-wider text-gray-600">
                      {advocate?.designation}
                    </p>
                  </div>

                  {/* 👉 Always-at-bottom Button */}
                  <Link
                    href={`/advocates/${advocate?._id}`}
                    className="bg-[#5e3030] text-white px-6 py-3 mt-6 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer"
                  >
                    View
                  </Link>
                </div>
              </div>)
            )) : (
           <div className=" col-span-full bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg p-5 mt-8 max-w-sm mx-auto text-center shadow-lg">
            <svg
              className="mx-auto mb-2 w-10 h-10 text-yellow-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 11-9 9 9 9 0 019-9z" />
            </svg>
            <p className="text-lg font-semibold">No advocates found.</p>
            <p className="mt-1 text-sm">Please try again later or contact support if you need help.</p>
          </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Advocates;
