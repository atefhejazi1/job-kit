import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages - Inbox",
  description:
    "Communicate with employers. View and respond to messages about your job applications.",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
