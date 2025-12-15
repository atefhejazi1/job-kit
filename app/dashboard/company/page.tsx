"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserInfo from "@/components/dashboard/UserInfo";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Briefcase,
  Users,
  TrendingUp,
  Calendar,
  ChevronRight,
  Loader2, // Added for loading state in the chart
} from "lucide-react";

// --- Interfaces (Kept as is) ---
interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  thisWeekApplications: number;
  totalApplications: number;
  interviewsScheduled: number;
  hiredThisMonth: number;
}

interface Job {
  id: string;
  title: string;
  applicationsCount: number;
  postedDate: string;
  status: "active" | "closed";
}

interface Application {
  id: string;
  applicantName: string;
  position: string;
  appliedDate: string;
  status: string;
}

interface ChartData {
  date: string;
  applications: number;
}
// --- End Interfaces ---

export default function CompanyDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    openJobs: 0,
    closedJobs: 0,
    thisWeekApplications: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiredThisMonth: 0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Check if user is COMPANY and is available before fetching
      if (!user || user.userType !== "COMPANY") {
        setLoading(false);
        return;
      }

      try {
        const headers = createApiHeadersWithoutContentType(user);

        // Fetch stats
        const [
          statsResponse,
          jobsResponse,
          applicationsResponse,
          chartDataResponse,
        ] = await Promise.all([
          fetch("/api/dashboard/stats", { headers }),
          fetch("/api/dashboard/company/jobs?limit=5", { headers }),
          fetch("/api/dashboard/company/applications?limit=5", { headers }),
          fetch("/api/dashboard/company/chart-data", { headers }),
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          console.error("Stats API error:", statsResponse.status);
          toast.error("Failed to load stats");
        }

        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setRecentJobs(jobsData);
        } else {
          console.error("Jobs API error:", jobsResponse.status);
        }

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setRecentApplications(applicationsData);
        } else {
          console.error("Applications API error:", applicationsResponse.status);
        }

        if (chartDataResponse.ok) {
          const chartData = await chartDataResponse.json();
          setChartData(chartData);
        } else {
          console.warn("Chart data API failed. Using mock data.");
          setChartData(generateMockData());
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        // Use mock data for chart if network fails completely
        setChartData(generateMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Mock data generator (kept as is)
  const generateMockData = (): ChartData[] => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const baseValue = 5;
      const trend = (29 - i) * 0.5;
      const randomVariation = Math.floor(Math.random() * 15);
      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        applications: Math.max(3, baseValue + trend + randomVariation),
      });
    }
    return data;
  };

  // Stat Card Component (Updated for Dark Mode and dynamic color class handling)
  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number | string;
    subtitle: string;
    icon: any;
    color: "blue" | "green" | "purple" | "orange";
  }) => {
    const iconClasses = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      green:
        "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
      purple:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
      orange:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-2 dark:text-white">
              {value}
            </p>
            <p className="text-sm text-gray-500 mt-1 dark:text-slate-500">
              {subtitle}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${iconClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  // Helper for Application Status colors
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "SHORTLISTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "HIRED":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* User Info (Assuming UserInfo handles its own dark mode) */}
      <UserInfo />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "Team"}!
        </h1>
        <p className="text-blue-100">
          Here's your company recruitment dashboard for this week
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Jobs Posted"
          value={loading ? "..." : stats.totalJobs}
          subtitle="All time postings"
          icon={Briefcase}
          color="blue"
        />
        <StatCard
          title="Applications This Week"
          value={loading ? "..." : stats.thisWeekApplications}
          subtitle="New applications"
          icon={Users}
          color="green"
        />
        <StatCard
          title="Open / Closed"
          value={loading ? "..." : `${stats.openJobs} / ${stats.closedJobs}`}
          subtitle="Current status"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Interviews Scheduled"
          value={loading ? "..." : stats.interviewsScheduled}
          subtitle="Upcoming interviews"
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Application Activity (Last 30 Days)
            </h2>
            <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
              Number of applications received daily
            </p>
          </div>
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-gray-500 dark:text-slate-400">
                Loading chart...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                  vertical={false}
                  className="dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: user ? "var(--tw-color-slate-400)" : "#9ca3af" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  tick={{ fill: user ? "var(--tw-color-slate-400)" : "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgb(255 255 255 / 0.9)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  }}
                  itemStyle={{ color: "#333" }}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Bar
                  dataKey="applications"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">
            Summary
          </h3>
          <div className="space-y-4">
            {/* Total Applications */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700/50">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Total Applications
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {loading ? "..." : stats.totalApplications}
              </span>
            </div>
            {/* Hired This Month */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700/50">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Hired This Month
              </span>
              <span className="text-lg font-bold text-green-600">
                {loading ? "..." : stats.hiredThisMonth}
              </span>
            </div>
            {/* Open Positions */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700/50">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Open Positions
              </span>
              <span className="text-lg font-bold text-blue-600">
                {loading ? "..." : stats.openJobs}
              </span>
            </div>
            {/* Closed Positions */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-slate-700/50">
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Closed Positions
              </span>
              <span className="text-lg font-bold text-gray-600 dark:text-slate-400">
                {loading ? "..." : stats.closedJobs}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 dark:border-slate-700">
            <button
              onClick={() => router.push("/dashboard/company/add-job")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
            <button
              onClick={() => router.push("/dashboard/company/all-jobs")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/60"
            >
              <Briefcase className="w-4 h-4" />
              View All Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Recent Jobs & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Latest 5 Jobs Posted
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {loading ? (
              <div className="p-6 text-center text-gray-500 dark:text-slate-400">
                Loading...
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-slate-400">
                  No jobs posted yet
                </p>
                <button
                  onClick={() => router.push("/dashboard/company/add-job")}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Post your first job →
                </button>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
                        {job.applicationsCount} applications
                      </p>
                      <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">
                        Posted {job.postedDate}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        job.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {job.status === "active" ? "Active" : "Closed"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 dark:bg-slate-700/50 dark:border-slate-700">
            <button
              onClick={() => router.push("/dashboard/company/all-jobs")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View all jobs <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Latest 5 Applications
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {loading ? (
              <div className="p-6 text-center text-gray-500 dark:text-slate-400">
                Loading...
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-slate-400">
                  No applications yet
                </p>
              </div>
            ) : (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 hover:bg-gray-50 transition-colors dark:hover:bg-slate-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {app.applicantName}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                        {app.position}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">
                        Applied {app.appliedDate}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 dark:bg-slate-700/50 dark:border-slate-700">
            <button
              onClick={() => router.push("/dashboard/company/applications")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              View all applications <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}