import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interviews - Schedule & Manage",
  description:
    "Schedule and manage interviews with candidates. View upcoming and past interviews.",
};

export default function CompanyInterviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
