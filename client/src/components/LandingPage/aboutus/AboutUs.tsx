"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";

// const ProgressBar: React.FC<ProgressBarProps> = ({ label, percentage }) => (
//   <div className="mb-4">
//     <div className="flex justify-between items-center mb-1">
//       <span className="text-gray-700 font-medium">{label}</span>
//       <span className="text-[#3c2c2c] font-semibold">{percentage}%</span>
//     </div>
//     <div className="w-full bg-gray-200 rounded-full h-3">
//       <div
//         className="bg-[#3c2c2c] h-3 rounded-full transition-all duration-700 ease-in-out"
//         style={{ width: `${percentage}%` }}
//       />
//     </div>
//   </div>
// );

function AboutUs() {
  return (
    <section className="relative py-20 px-6 sm:px-10 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold relative inline-block">
            <span className="relative z-10 text-2xl md:text-3xl font-bold text-gray-800">
              About Us
            </span>
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-16 h-0.5 bg-[#3c2c2c] -mb-2"></span>
          </p>
          <div className="flex justify-center mt-4">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 bg-[#3c2c2c] rounded-full mx-0.5"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          {/* Image */}
          <div className="flex justify-center items-center ">
            <Image
              src="https://cdn.pixabay.com/photo/2022/10/05/07/08/gavel-7499911_640.jpg"
              alt="Legal Professional"
              width={640}
              height={427} // aspect ratio maintain korun
              className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500 object-cover"
            />
          </div>
          {/* What We Do */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              What We Do
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are committed to delivering high-quality legal services and
              ensuring client satisfaction. Our firm offers a wide range of
              legal assistance to empower and protect your rights.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              With years of experience and a team of dedicated professionals, we
              help navigate through legal complexities with ease.
            </p>

            <ul className="space-y-3 text-gray-700">
              {[
                "Expert legal consultation",
                "Strong case representation",
                "Trusted by 500+ clients",
                "Client-focused approach",
                "Transparent legal process",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircleIcon
                    fontSize="small"
                    className="text-[#3c2c2c] mr-2 mt-0.5"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Progress */}
          {/* <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Our Progress
            </h3>
            <ProgressBar label="Family Law" percentage={87} />
            <ProgressBar label="Legal Law" percentage={79} />
            <ProgressBar label="Criminal Law" percentage={82} />
            <ProgressBar label="Finance Law" percentage={65} />
            <ProgressBar label="Property Law" percentage={90} />
            <ProgressBar label="Education Law" percentage={80} />
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
