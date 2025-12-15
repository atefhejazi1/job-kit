"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUserType } from "@/contexts/AuthContext";

interface AuthRedirectProps {
  children: React.ReactNode;
}


export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { userType } = useUserType();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If user is authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (userType === "COMPANY") {
        router.push("/dashboard/company");
      } else if (userType === "USER") {
        router.push("/dashboard/user");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, userType, router]);

  return <>{children}</>;
}
