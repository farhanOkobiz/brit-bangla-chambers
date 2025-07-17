import AboutUs from "@/components/LandingPage/aboutus/AboutUs";
import Advocates from "@/components/LandingPage/advocates/Advocates";
import { HeroSection } from "@/components/LandingPage/hero/Hero";
import OurExpertise from "@/components/LandingPage/ourExpertise/OurExpertise";
import Partners from "@/components/LandingPage/partners/Partners";
import { Services } from "@/components/LandingPage/Services/Services";
import StatsAndGrowth from "@/components/LandingPage/statsAndGrowth/StatsAndGrowth";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <AboutUs />
      <Services></Services>
      <OurExpertise />
      <StatsAndGrowth />
      <Partners />
      <Advocates />
    </div>
  );
}
