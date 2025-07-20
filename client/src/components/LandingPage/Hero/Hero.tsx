export function HeroSection() {
  return (
    <section
      className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `url('/images/banner/banner-image.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-[#3c2c2c] opacity-80"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-8">
          We Provide Finance Law
        </h1>
        <p className="text-md md:text-lg mb-3 md:mb-6">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        </p>
        <button className="bg-[#5e3030] text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-200 hover:text-gray-900 transition cursor-pointer">
          Learn More
        </button>
      </div>
    </section>
  );
}
