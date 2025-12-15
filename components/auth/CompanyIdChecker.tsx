"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CompanyIdChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if company user has companyId
    if (user?.userType === "COMPANY" && !user.companyId) {
      toast.error(
        "Your session is outdated. Please log in again to access company features."
      );
      logout();
      router.push("/login");
    }
  }, [user, logout, router]);

  if (user?.userType === "COMPANY" && !user.companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Expired
          </h2>
          <p className="text-gray-600 mb-4">Please log in again to continue.</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
