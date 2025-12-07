import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Jobs - Your Bookmarked Opportunities",
  description:
    "View and manage your saved jobs. Keep track of opportunities you're interested in.",
};

export default function SavedJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
