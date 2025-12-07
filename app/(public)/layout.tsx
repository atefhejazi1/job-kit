import { Metadata } from "next";
// PublicLayout.tsx

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Home - Find Your Dream Job",
  description:
    "Welcome to JobKit! Discover thousands of job opportunities from top companies. Build your professional resume and start your career journey today.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // This div correctly responds to the 'dark' class on <html>
    <>
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
}