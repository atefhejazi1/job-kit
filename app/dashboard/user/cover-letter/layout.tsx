import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter Generator - AI Powered",
  description:
    "Generate professional cover letters using AI. Customize for each job application.",
};

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
