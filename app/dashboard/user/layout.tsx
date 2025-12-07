"use client";

import { ResumeProvider } from "@/contexts/ResumeContext";

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResumeProvider>{children}</ResumeProvider>;
}

// Note: Metadata is handled in child layouts due to client component
