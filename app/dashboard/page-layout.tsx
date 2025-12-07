import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your JobKit account, applications, and job postings.",
};

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
