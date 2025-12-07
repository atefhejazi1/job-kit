import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Jobs - Manage Your Listings",
  description:
    "View and manage all your job postings. Edit, pause, or delete job listings.",
};

export default function AllJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
