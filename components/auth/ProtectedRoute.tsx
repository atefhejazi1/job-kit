"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "USER" | "COMPANY";
}

export default function ProtectedRoute({
  children,
  requiredUserType,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname || "/");
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // If specific user type is required and user doesn't match, redirect
    if (requiredUserType && user?.userType !== requiredUserType) {
      // Redirect to appropriate dashboard based on user type
      if (user?.userType === "COMPANY") {
        router.push("/dashboard/company");
      } else if (user?.userType === "USER") {
        router.push("/dashboard/user");
      } else {
        router.push("/login");
      }
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredUserType, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render the protected content
  if (!isAuthenticated) {
    return null;
  }

  // If user type doesn't match required type, don't render
  if (requiredUserType && user?.userType !== requiredUserType) {
    return null;
  }

  // If user is authenticated and has correct permissions, show the protected content
  return <>{children}</>;
}
