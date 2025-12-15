import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - Join JobKit",
  description:
    "Create your free JobKit account to find jobs, build your resume, and connect with top employers.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
