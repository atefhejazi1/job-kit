import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post New Job - Reach Top Talent",
  description:
    "Create a new job posting and reach thousands of qualified candidates.",
};

export default function AddJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
