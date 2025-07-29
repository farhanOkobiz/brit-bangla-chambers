import React from "react";

interface StatItemProps {
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-5xl font-bold text-white mb-2 leading-tight">
        {value}
      </p>
      <p className="text-lg text-gray-400 uppercase tracking-wide">{label}</p>
    </div>
  );
};

const StatsAndGrowth: React.FC = () => {
  return (
    <section className="bg-[#151515] lg:py-24 md:py-16 py-10 px-4 md:px-8 lg:px-16">
      {" "}
      {/* Dark background */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Stat Item 1 */}
        <StatItem value="1000+" label="Client Consultations" />

        {/* Stat Item 2 */}
        <StatItem value="95%" label="Successful Cases" />

        {/* Stat Item 3 */}
        <StatItem value="10mlns" label="Recovered cost for clients" />

        {/* Stat Item 4 */}
        <StatItem value="30+" label="Professional Attorneys" />
      </div>
    </section>
  );
};

export default StatsAndGrowth;
