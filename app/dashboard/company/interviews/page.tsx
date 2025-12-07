"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import Link from "next/link";

interface Interview {
  id: string;
  title: string;
  description: string;
  interviewType: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink?: string;
  location?: string;
  job: {
    id: string;
    title: string;
    company: {
      companyName: string;
      logo: string;
    };
  };
  candidate: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  application: {
    id: string;
    status: string;
  };
}

export default function CompanyInterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const router = useRouter();

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interviews, filter, typeFilter, searchQuery, dateRange]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/interviews", {
        headers: createApiHeadersWithoutContentType(user),
      });
      const data = await response.json();
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...interviews];

    // Status filter
    if (filter !== "ALL") {
      filtered = filtered.filter((i) => i.status === filter);
    }

    // Type filter
    if (typeFilter !== "ALL") {
      filtered = filtered.filter((i) => i.interviewType === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.candidate.name.toLowerCase().includes(query) ||
          i.job.title.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(
        (i) => new Date(i.scheduledAt) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      filtered = filtered.filter(
        (i) => new Date(i.scheduledAt) <= new Date(dateRange.to)
      );
    }

    setFilteredInterviews(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "NO_SHOW":
        return "bg-orange-100 text-orange-800";
      case "RESCHEDULED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO_CALL":
        return "🎥";
      case "PHONE_CALL":
        return "📞";
      case "IN_PERSON":
        return "🏢";
      case "ASSESSMENT":
        return "📝";
      default:
        return "📅";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
        <Link
          href="/dashboard/company/interviews/calendar"
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          📅 Calendar View
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search by title, candidate name, or job..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              "ALL",
              "SCHEDULED",
              "CONFIRMED",
              "IN_PROGRESS",
              "COMPLETED",
              "CANCELLED",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interview Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {["ALL", "VIDEO_CALL", "PHONE_CALL", "IN_PERSON", "ASSESSMENT"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    typeFilter === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "ALL" ? "All Types" : type.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchQuery ||
          filter !== "ALL" ||
          typeFilter !== "ALL" ||
          dateRange.from ||
          dateRange.to) && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilter("ALL");
              setTypeFilter("ALL");
              setDateRange({ from: "", to: "" });
            }}
            className="mt-4 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            ✕ Clear All Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredInterviews.length} of {interviews.length} interviews
      </div>

      {/* Interviews List */}
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            {interviews.length === 0
              ? "No interviews found"
              : "No interviews match your filters"}
          </p>
          <p className="text-gray-400 mt-2">
            Schedule interviews from the Applications page
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInterviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getTypeIcon(interview.interviewType)}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {interview.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {interview.job.title} • {interview.candidate.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    📅 {formatDate(interview.scheduledAt)} •{" "}
                    {interview.duration} minutes
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    interview.status
                  )}`}
                >
                  {interview.status.replace("_", " ")}
                </span>
              </div>

              {interview.description && (
                <p className="text-gray-600 mb-4">{interview.description}</p>
              )}

              {interview.meetingLink && (
                <div className="mb-3">
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 text-sm"
                  >
                    🔗 Join Meeting
                  </a>
                </div>
              )}

              {interview.location && (
                <p className="text-gray-600 text-sm mb-3">
                  📍 {interview.location}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/dashboard/company/interviews/${interview.id}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  View Details
                </Link>
                {interview.status === "CONFIRMED" && (
                  <Link
                    href={`/dashboard/company/interviews/${interview.id}/feedback`}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm"
                  >
                    Add Feedback
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
