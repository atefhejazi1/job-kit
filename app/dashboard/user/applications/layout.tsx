import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications - Track Your Progress",
  description:
    "View and track all your job applications. Monitor application status and interview schedules.",
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
