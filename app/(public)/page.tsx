import About from "@/components/shared/About";
import Hero from "@/components/shared/Hero";
import ResumeSteps from "@/components/shared/ResumeSteps";
import Services from "@/components/shared/Services";
import Snapchat from "@/components/shared/Snapchat";
import Testimonials from "@/components/shared/Testimonials";
import WhyChooseUs from "@/components/shared/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <ResumeSteps />
      <Snapchat />
      <Services />
      <About />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
