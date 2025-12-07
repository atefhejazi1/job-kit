import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Account Settings",
  description:
    "Manage your profile information, account settings, and preferences.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
