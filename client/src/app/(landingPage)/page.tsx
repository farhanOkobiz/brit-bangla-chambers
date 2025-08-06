import AboutUs from "@/components/LandingPage/aboutus/AboutUs";
import HeroComponent from "@/components/LandingPage/Hero/HeroComponent";
import OurExpertise from "@/components/LandingPage/ourExpertise/OurExpertise";
import { Services } from "@/components/LandingPage/Services/Services";
import StatsAndGrowth from "@/components/LandingPage/statsAndGrowth/StatsAndGrowth";
 import Advocates from "@/components/LandingPage/advocates/AdvocateCard";
//import Blogs from "@/components/blogs/Blogs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import ContactUs from "@/components/LandingPage/ContactUs/ContactUs";
import Blogs from "@/components/blogs/Blogs";

export default function Home() {
  return (
    <div>
      <HeroComponent />
      <AboutUs />
      <Services></Services>
      <OurExpertise />
      <Advocates />
      <WhyChooseUs />
      <StatsAndGrowth />
      <Blogs />
      <ContactUs />
    </div>
  );
}
