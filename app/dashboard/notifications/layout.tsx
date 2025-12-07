import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "View your notifications about job applications, interviews, and messages.",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
