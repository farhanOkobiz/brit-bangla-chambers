import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";

interface ExpertiseItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ExpertiseItem: React.FC<ExpertiseItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start mb-8 last:mb-0 relative z-10">
      <div className="flex-shrink-0 mr-4">{icon}</div>
      <div>
        <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
};

function OurExpertise() {
  return (
    <section
      className="relative py-4 md:py-6 lg:py-8 px-4 md:px-8 lg:px-16 bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2022/04/10/16/42/lawyer-7123799_640.jpg')",
      }}
    >
      <div className="relative z-10 mx-auto grid grid-cols-1 md:grid-cols-2 items-center max-w-7xl">
        {/* Left Column: Expertise Content with overlay */}
        <div className="relative p-8">
          {/* 🔹 Overlay for only this block */}
          <div className="absolute inset-0 bg-[#5a2e2e] opacity-80 z-0 rounded-lg"></div>

          {/* 🔸 Content above overlay */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Our Expertise</h2>
            <div className="w-20 h-1 bg-white  mb-8"></div>

            <ExpertiseItem
              icon={<BusinessCenterOutlinedIcon className="w-12 h-12 " />}
              title="Corporate & Securities"
              description="Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind. One morning, when Gregor Samsa woke from troubled."
            />
            <ExpertiseItem
              icon={<HomeWorkOutlinedIcon className="w-12 h-12 " />}
              title="Real Estate Law"
              description="Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind. One morning, when Gregor Samsa woke from troubled."
            />
          </div>
        </div>

        {/* Right Column: Empty or future image/content */}
        <div></div>
      </div>
    </section>
  );
}

export default OurExpertise;
