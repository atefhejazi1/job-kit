"use client";

import About from "@/components/shared/About";
import Hero from "@/components/shared/Hero";
import QuickStats from "@/components/shared/QuickStats";
import Features from "@/components/shared/Features";
import ResumeSteps from "@/components/shared/ResumeSteps";
import Services from "@/components/shared/Services";
import Testimonials from "@/components/shared/Testimonials";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import Jobs from "@/components/Jobs";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickStats />
      <Features />
      <ResumeSteps />
      <Services />
      <Jobs />
      <About />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
