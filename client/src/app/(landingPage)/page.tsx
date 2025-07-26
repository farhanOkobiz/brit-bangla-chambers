import AboutUs from "@/components/LandingPage/aboutus/AboutUs";
import { HeroSection } from "@/components/LandingPage/hero/Hero";
import OurExpertise from "@/components/LandingPage/ourExpertise/OurExpertise";
import { Services } from "@/components/LandingPage/Services/Services";
import StatsAndGrowth from "@/components/LandingPage/statsAndGrowth/StatsAndGrowth";
import Advocates from "@/components/LandingPage/advocates/Advocates";
import Blogs from "@/components/blogs/Blogs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Faq from "@/components/LandingPage/faq/Faq";
import ContactUs from "@/components/LandingPage/ContactUs/ContactUs";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <AboutUs />
      <Services></Services>
      <OurExpertise />
      <Advocates />
      <WhyChooseUs />
      <StatsAndGrowth />
      <Blogs />
      <ContactUs />
      <Faq />
    </div>
  );
}
