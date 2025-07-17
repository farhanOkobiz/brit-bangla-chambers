import AboutUs from "@/components/LandingPage/aboutus/AboutUs";
import { HeroSection } from "@/components/LandingPage/hero/Hero";
import OurExpertise from "@/components/LandingPage/ourExpertise/OurExpertise";
import Partners from "@/components/LandingPage/advocates/Advocates";
import { Services } from "@/components/LandingPage/Services/Services";
import StatsAndGrowth from "@/components/LandingPage/statsAndGrowth/StatsAndGrowth";
import Advocates from "@/components/LandingPage/advocates/Advocates";
import Blogs from "@/components/blogs/Blogs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <AboutUs />
      <Services></Services>
      <OurExpertise />
      <StatsAndGrowth />
      <Advocates />
      <WhyChooseUs />
      <Blogs />
    </div>
  );
}
