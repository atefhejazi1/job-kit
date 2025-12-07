import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Dashboard - Manage Your Hiring",
  description:
    "Manage your job postings, review applications, schedule interviews, and connect with candidates.",
};

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
