import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Settings",
  description:
    "Manage your company profile, logo, description, and account settings.",
};

export default function CompanySettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
