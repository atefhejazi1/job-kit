"use client";

import About from "@/components/shared/About";
import Hero from "@/components/shared/Hero";
import ResumeSteps from "@/components/shared/ResumeSteps";
import Services from "@/components/shared/Services";
import Snapchat from "@/components/shared/Snapchat";
import Testimonials from "@/components/shared/Testimonials";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import AuthRedirect from "@/components/auth/AuthRedirect";
import Jops from "@/components/Jops";

export default function Home() {
  return (
    <AuthRedirect>
      <Hero />
      <ResumeSteps />
      <Snapchat />
      <Services />
      <Jops />
      <About />
      <WhyChooseUs />
      <Testimonials />
    </AuthRedirect>
  );
}
