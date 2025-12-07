import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Interviews - Upcoming & Past",
  description:
    "Manage your interview schedule. View upcoming interviews, past interviews, and interview details.",
};

export default function InterviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
