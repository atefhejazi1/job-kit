import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications - Review Candidates",
  description:
    "Review job applications from candidates. Shortlist, interview, or reject applicants.",
};

export default function CompanyApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
