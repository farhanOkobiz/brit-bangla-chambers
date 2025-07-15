import Advocates from "@/components/LandingPage/Advocates/Advocates";
import { HeroSection } from "@/components/LandingPage/Hero/Hero";
import { Services } from "@/components/LandingPage/Services/Services";


export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <Services></Services>
      <Advocates/>
    </div>
  );
}
