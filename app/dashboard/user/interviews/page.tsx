"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createApiHeadersWithoutContentType,
  createApiHeaders,
} from "@/lib/api-utils";
import Link from "next/link";
import toast from "react-hot-toast";

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
  company: {
    id: string;
    name: string;
    email: string;
  };
}

export default function UserInterviewsPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const router = useRouter();

  useEffect(() => {
    fetchInterviews();
  }, [filter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const url =
        filter === "ALL"
          ? "/api/interviews"
          : `/api/interviews?status=${filter}`;
      const response = await fetch(url, {
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

  const handleConfirm = async (interviewId: string) => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}/confirm`, {
        method: "POST",
        headers: createApiHeaders(user),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("API Error Response:", error);
        console.error("Status:", response.status);
        throw new Error(error.error || "Failed to confirm interview");
      }

      toast.success("Interview confirmed successfully!");
      fetchInterviews();
    } catch (error: any) {
      console.error("Error confirming interview:", error);
      toast.error(error.message || "Failed to confirm interview");
    }
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

  const isUpcoming = (scheduledAt: string) => {
    return new Date(scheduledAt) > new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const pendingInterviews = interviews.filter((i) => i.status === "SCHEDULED");
  const upcomingInterviews = interviews.filter(
    (i) =>
      (i.status === "CONFIRMED" || i.status === "SCHEDULED") &&
      isUpcoming(i.scheduledAt)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Interviews</h1>
      </div>

      {/* Pending Confirmations Alert */}
      {pendingInterviews.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-800">
                You have {pendingInterviews.length} interview
                {pendingInterviews.length > 1 ? "s" : ""} waiting for
                confirmation
              </p>
              <p className="text-sm text-orange-700 mt-1">
                Please confirm your availability as soon as possible
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
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

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No interviews found</p>
          <p className="text-gray-400 mt-2">
            Your upcoming interviews will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map((interview) => (
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
                    {interview.job.title} • {interview.job.company.companyName}
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
                  href={`/dashboard/user/interviews/${interview.id}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  View Details
                </Link>
                {interview.status === "SCHEDULED" && (
                  <button
                    onClick={() => handleConfirm(interview.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm"
                  >
                    ✓ Confirm Attendance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
