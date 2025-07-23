"use client";

import React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  audience: string;
  created_at: string;
}

const faqList: FaqItem[] = [
  {
    _id: "1",
    audience: "both",
    question: "How to book a consultation?",
    answer: "Go to the advocate profile and click Book Now.",
    created_at: "2025-07-17T10:00:00Z",
  },
  {
    _id: "2",
    audience: "client",
    question: "Do I need to create an account?",
    answer: "Yes, clients must create an account before booking.",
    created_at: "2025-07-10T09:00:00Z",
  },
  {
    _id: "3",
    audience: "advocate",
    question: "How do I manage my bookings?",
    answer: "Go to your dashboard and click on 'My Bookings'.",
    created_at: "2025-07-12T11:00:00Z",
  },
];

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Faq() {
  return (
    <section className="py-4 md:py-8 lg:py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Answers for clients and advocates
        </h2>
        <p className="text-lg text-gray-600 mb-4">Frequently Asked Questions</p>
        <div className="w-24 h-1 bg-[#4f2b2b] mx-auto mb-10"></div>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2  gap-8 px-4">
        {/* Left image */}
        <div className="h-auto w-full">
          <Image
            width={400}
            height={400}
            src="/images/faqs/faq.jpg"
            alt="faq"
            className="rounded-xl shadow-lg object-cover w-full h-auto"
          />
        </div>

        {/* FAQ Content */}
        <div className="">
          <Accordion
            defaultValue={faqList[0]._id}
            type="single"
            collapsible
            className="w-full space-y-2"
          >
            {faqList.map((faq) => (
              <AccordionItem key={faq._id} value={faq._id}>
                <AccordionTrigger className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{faq.question}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
                      {faq.audience}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-sm mt-2">
                  <p className="mb-2">{faq.answer}</p>
                  <p className="text-xs text-gray-400">
                    Posted on {formatDate(faq.created_at)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default Faq;
