// app/terms-and-conditions/page.tsx
import React from "react";

export const metadata = {
  title: "Terms and Conditions - Brit Bangla Law Chambers",
  description:
    "Read our Terms and Conditions governing the use of our legal services and website.",
};

const TermsAndConditionsPage = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-900">
        Terms & Conditions
      </h1>

      <section className="space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          Welcome to Brit Bangla Chambers. By accessing or using our website
          or legal services, you agree to be bound by the following terms and
          conditions. If you disagree with any part, please do not use our
          services.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            1. Legal Disclaimer
          </h2>
          <p>
            All content provided on this website is for general information only
            and does not constitute legal advice. You should seek specific legal
            counsel for any individual legal concerns.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            2. Client-Lawyer Relationship
          </h2>
          <p>
            No client-lawyer relationship is formed by using this site. You must
            engage our services formally by agreement before such a relationship
            is established.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            3. Confidentiality
          </h2>
          <p>
            We maintain strict confidentiality in line with the laws of
            Bangladesh and the Bar Council Rules. However, using our website
            does not guarantee the confidentiality of any information
            transmitted online.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            4. Limitation of Liability
          </h2>
          <p>
            Brit Bangla Law Chambers shall not be held liable for any damages
            arising from the use or inability to use our website or services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            5. Governing Law
          </h2>
          <p>
            These terms shall be governed by and interpreted in accordance with
            the laws of the People’s Republic of Bangladesh. Any disputes shall
            be subject to the exclusive jurisdiction of the courts of Dhaka.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these terms at any time. Continued
            use of our site and services implies acceptance of the updated
            terms.
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Last Updated: August 7, 2025
        </p>
      </section>
    </main>
  );
};

export default TermsAndConditionsPage;
