import React from "react";

const WhyChooseUs: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-4 md:py-6 lg:py-8 px-4 md:px-8 lg:px-16">
      {/* Background Image/Overlay - Adjust as needed */}
      <div
        className="absolute inset-0 bg-cover bg-center "
        style={{
          backgroundImage: 'url("/images/whyChooseUs/whyChooseUs.jpg")',
          filter: "brightness(0.6)",
        }} // Replace with your actual image
      ></div>

      <div className="absolute inset-0 bg-[#5a2e2e] opacity-80 z-0 rounded-lg"></div>

      {/* Content Container */}
      <div className="relative z-10  mx-auto text-white">
        <div className="border border-gray-200 p-10 rounded-lg">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-gray-200">
              WHAT WE ARE EXPERT AT
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why Clients Choose Us?
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-4"></div>{" "}
            {/* Separator line */}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Text Column */}
            <div>
              <p className="text-lg leading-relaxed">
                Far far away, behind the word mountains, far from the countries
                Vokalia and Consonantia, there live the blind texts. Separated
                they live in Bookmarksgrove right at the coast of the Semantics,
                a large language ocean. A small river named Duden flows by their
                place.
              </p>
            </div>

            {/* Right Text Column */}
            <div>
              <p className="text-lg leading-relaxed">
                A wonderful serenity has taken possession of my entire soul,
                like these sweet mornings of spring which I enjoy with my whole
                heart. I am alone, and feel the charm of existence in this spot,
                which was created for the bliss of souls like mine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
