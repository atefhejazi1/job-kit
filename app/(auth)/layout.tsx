import React from "react";
import { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account to access JobKit features.",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthGuard>
      <div className="auth-layout">{children}</div>
    </AuthGuard>
  );
}
