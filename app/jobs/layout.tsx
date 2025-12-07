import { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Browse Jobs - Find Your Next Opportunity",
  description:
    "Explore thousands of job listings from top companies. Filter by location, salary, work type, and skills to find the perfect job for you.",
  keywords: [
    "job listings",
    "job search",
    "find jobs",
    "career opportunities",
    "employment",
  ],
};

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
