import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages - Communicate with Candidates",
  description:
    "Send and receive messages with job candidates. Manage all your conversations.",
};

export default function CompanyMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
