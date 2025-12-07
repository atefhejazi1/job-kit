import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#363636",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
