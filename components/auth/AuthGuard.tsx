"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUserType } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { userType } = useUserType();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth state to load
    if (isLoading) return;

    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      if (userType === "COMPANY") {
        router.push("/dashboard/company");
      } else if (userType === "USER") {
        router.push("/dashboard/user");
      } else {
        // Fallback to general dashboard
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, userType, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, don't render the auth pages
  if (isAuthenticated) {
    return null;
  }

  // If user is not authenticated, show the auth pages
  return <>{children}</>;
}
