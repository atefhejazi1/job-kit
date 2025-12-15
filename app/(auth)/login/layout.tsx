import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Access Your Account",
  description:
    "Sign in to your JobKit account to manage your job applications, resume, and connect with employers.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
