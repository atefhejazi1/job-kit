import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ClientAppWrapper from "@/utils/ClientAppWrapper";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "JobKit - Find Your Dream Job & Build Your Career",
    template: "%s | JobKit",
  },
  description:
    "JobKit is your ultimate job search platform. Find thousands of job opportunities, build professional resumes, and connect with top employers. Start your career journey today!",
  keywords: [
    "jobs",
    "job search",
    "career",
    "employment",
    "resume builder",
    "job opportunities",
    "hiring",
    "recruitment",
    "job portal",
    "find jobs",
  ],
  authors: [{ name: "JobKit Team" }],
  creator: "JobKit",
  publisher: "JobKit",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JobKit",
    title: "JobKit - Find Your Dream Job & Build Your Career",
    description:
      "Find thousands of job opportunities, build professional resumes, and connect with top employers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobKit - Find Your Dream Job & Build Your Career",
    description:
      "Find thousands of job opportunities, build professional resumes, and connect with top employers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ClientAppWrapper>{children}</ClientAppWrapper>
      </body>
    </html>
  );
}
