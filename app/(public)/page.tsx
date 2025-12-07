"use client";

import About from "@/components/shared/About";
import Hero from "@/components/shared/Hero";
import QuickStats from "@/components/shared/QuickStats";
import Features from "@/components/shared/Features";
import ResumeSteps from "@/components/shared/ResumeSteps";
import Services from "@/components/shared/Services";
import Snapchat from "@/components/shared/Snapchat";
import Testimonials from "@/components/shared/Testimonials";
import WhyChooseUs from "@/components/shared/WhyChooseUs";
import Jops from "@/components/Jops";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickStats />
      <Features />
      <ResumeSteps />
      <Services />
      <Jops />
      <About />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
