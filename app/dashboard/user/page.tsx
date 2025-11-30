"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

function UserDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute requiredUserType="USER">
      <UserDashboard />
    </ProtectedRoute>
  );
}
