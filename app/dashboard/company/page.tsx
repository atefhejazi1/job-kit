"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserInfo from "@/components/dashboard/UserInfo";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  interviewsScheduled: number;
  hiredThisMonth: number;
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiredThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats", {
          headers: createApiHeadersWithoutContentType(user),
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === "COMPANY") {
      fetchStats();
    }
  }, [user]);

  const quickActions = [
    {
      title: "Post New Job",
      description: "Create a job listing",
      icon: "plus",
      color: "primary",
      action: () => router.push("/dashboard/company/add-job"),
    },
    {
      title: "View All Jobs",
      description: "Manage your postings",
      icon: "briefcase",
      color: "green",
      action: () => router.push("/dashboard/company/all-jobs"),
    },
    {
      title: "View Analytics",
      description: "Performance insights",
      icon: "chart",
      color: "blue",
      action: () => toast("Analytics coming soon!", { icon: "📊" }),
    },
    {
      title: "Company Settings",
      description: "Manage preferences",
      icon: "settings",
      color: "purple",
      action: () => router.push("/dashboard/company/settings"),
    },
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "plus":
        return (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        );
      case "briefcase":
        return (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01"
            />
          </svg>
        );
      case "chart":
        return (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "settings":
        return (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };
  return (
    <div className="space-y-6">
      {/* User Info Section */}
      <UserInfo />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to your Company Dashboard!
        </h1>
        <p className="text-orange-100">
          Here's what's happening with your job postings today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.activeJobs}
              </p>
              <p className="text-sm text-green-600">Total posted jobs</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM8 14v.01M12 14v.01M16 14v.01"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.totalApplications}
              </p>
              <p className="text-sm text-green-600">All time applications</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Interview Scheduled
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.interviewsScheduled}
              </p>
              <p className="text-sm text-blue-600">Upcoming interviews</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <svg
                className="h-8 w-8 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m0 0h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h4z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Hired This Month
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.hiredThisMonth}
              </p>
              <p className="text-sm text-green-600">Successful hires</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <svg
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-${action.color}-500 hover:bg-${action.color}-50 transition-all duration-200 group`}
            >
              <div
                className={`p-3 rounded-full bg-${action.color}-500 group-hover:bg-${action.color}-600 transition-colors mb-3`}
              >
                {getIconComponent(action.icon)}
              </div>
              <span
                className={`font-medium text-gray-900 group-hover:text-${action.color}-600`}
              >
                {action.title}
              </span>
              <span className="text-sm text-gray-500">
                {action.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity & Top Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    New application received
                  </p>
                  <p className="text-sm text-gray-500">
                    Frontend Developer position • Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    Interview completed
                  </p>
                  <p className="text-sm text-gray-500">
                    Senior Developer position • Michael Chen
                  </p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    Job posting updated
                  </p>
                  <p className="text-sm text-gray-500">
                    UX Designer position requirements modified
                  </p>
                  <p className="text-xs text-gray-400">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    Candidate hired
                  </p>
                  <p className="text-sm text-gray-500">
                    Backend Developer position • Alex Rodriguez
                  </p>
                  <p className="text-xs text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                View all activity →
              </button>
            </div>
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Jobs
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Senior Frontend Developer
                  </h4>
                  <p className="text-sm text-gray-500">Posted 5 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">156</p>
                  <p className="text-xs text-gray-500">applications</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Product Manager</h4>
                  <p className="text-sm text-gray-500">Posted 3 days ago</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">89</p>
                  <p className="text-xs text-gray-500">applications</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">UX/UI Designer</h4>
                  <p className="text-sm text-gray-500">Posted 1 week ago</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">67</p>
                  <p className="text-xs text-gray-500">applications</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => router.push("/dashboard/company/all-jobs")}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View all jobs →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
