"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createApiHeadersWithoutContentType,
  createApiHeaders,
} from "@/lib/api-utils";
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
  meetingPassword?: string;
  location?: string;
  candidateNotes?: string;
  feedback?: string;
  rating?: number;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    company: {
      companyName: string;
      logo: string;
    };
  };
  company?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function UserInterviewDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [rescheduleReason, setRescheduleReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  const fetchInterview = async () => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        headers: createApiHeadersWithoutContentType(user),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error("Failed to fetch interview");
      }
      const data = await response.json();
      setInterview(data.interview);
    } catch (error) {
      console.error("Error fetching interview:", error);
      toast.error("Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const response = await fetch(`/api/interviews/${interviewId}/confirm`, {
        method: "POST",
        headers: createApiHeaders(user),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to confirm interview");
      }

      toast.success("Interview confirmed successfully!");
      fetchInterview();
    } catch (error: any) {
      console.error("Error confirming interview:", error);
      toast.error(error.message || "Failed to confirm interview");
    } finally {
      setConfirming(false);
    }
  };

  const handleRescheduleRequest = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/interviews/${interviewId}/reschedule`,
        {
          method: "POST",
          headers: createApiHeaders(user),
          body: JSON.stringify({ reason: rescheduleReason }),
        }
      );

      if (!response.ok) throw new Error("Failed to request reschedule");

      toast.success("Reschedule request sent successfully!");
      setShowRescheduleModal(false);
      fetchInterview();
    } catch (error) {
      console.error("Error requesting reschedule:", error);
      toast.error("Failed to request reschedule");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/interviews/${interviewId}/cancel`, {
        method: "POST",
        headers: createApiHeaders(user),
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (!response.ok) throw new Error("Failed to cancel");

      toast.success("Interview cancelled successfully!");
      setShowCancelModal(false);
      fetchInterview();
    } catch (error) {
      console.error("Error cancelling:", error);
      toast.error("Failed to cancel interview");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Interview not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">
                {getTypeIcon(interview.interviewType)}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">
                {interview.title}
              </h1>
            </div>
            <p className="text-gray-600">{interview.job.title}</p>
            <p className="text-gray-500">{interview.job.company.companyName}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
              interview.status
            )}`}
          >
            {interview.status.replace("_", " ")}
          </span>
        </div>

        {interview.description && (
          <p className="text-gray-700 mb-4">{interview.description}</p>
        )}

        {/* Date & Time */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
          <p className="text-sm text-gray-600">Scheduled For</p>
          <p className="text-lg font-semibold text-gray-900">
            📅 {formatDate(interview.scheduledAt)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Duration: {interview.duration} minutes
          </p>
        </div>

        {/* Meeting Details */}
        {interview.meetingLink && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Meeting Link</p>
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-700 text-lg inline-flex items-center gap-2"
            >
              🔗 Join Meeting
              <span className="text-xs text-gray-500">(opens in new tab)</span>
            </a>
            {interview.meetingPassword && (
              <p className="text-sm text-gray-600 mt-2">
                Password:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {interview.meetingPassword}
                </code>
              </p>
            )}
          </div>
        )}

        {interview.location && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Location</p>
            <p className="text-gray-900">📍 {interview.location}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {interview.status === "SCHEDULED" && (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {confirming ? "Confirming..." : "✓ Confirm Attendance"}
            </button>
          )}

          {!["COMPLETED", "CANCELLED", "NO_SHOW"].includes(
            interview.status
          ) && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="px-4 py-2 border-2 border-yellow-500 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                🔄 Request Reschedule
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 border-2 border-red-500 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Company Information
        </h2>
        <div className="flex items-start gap-4">
          {interview.job.company.logo ? (
            <img
              src={interview.job.company.logo}
              alt={interview.job.company.companyName}
              className="w-16 h-16 rounded"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
              {interview.job.company.companyName.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-lg">
              {interview.job.company.companyName}
            </p>
            {interview.company && (
              <>
                <p className="text-gray-600">{interview.company.email}</p>
                <p className="text-gray-600">
                  Contact: {interview.company.name}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Notes */}
      {interview.candidateNotes && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {interview.candidateNotes}
          </p>
        </div>
      )}

      {/* Feedback (if completed) */}
      {interview.feedback && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Interview Feedback
          </h2>
          <div className="mb-3">
            <span className="text-sm text-gray-600">Rating: </span>
            <span className="text-2xl">
              {"⭐".repeat(interview.rating || 0)}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">
            {interview.feedback}
          </p>
        </div>
      )}

      {/* Preparation Tips */}
      {interview.status !== "COMPLETED" && interview.status !== "CANCELLED" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">
            💡 Interview Preparation Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
            <li>Test your internet connection and equipment beforehand</li>
            <li>Review the job description and company information</li>
            <li>Prepare answers to common interview questions</li>
            <li>Have questions ready to ask the interviewer</li>
            <li>Join the meeting 5 minutes early</li>
            <li>Dress professionally and choose a quiet location</li>
            <li>Have your resume and notes handy</li>
          </ul>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Request Reschedule
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for requesting to reschedule this
              interview.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason
              </label>
              <textarea
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Why do you need to reschedule?"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRescheduleRequest}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {actionLoading ? "Sending..." : "Send Request"}
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cancel Interview
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this interview? This action cannot
              be undone.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Please provide a reason..."
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
