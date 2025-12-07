"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createApiHeaders,
  createApiHeadersWithoutContentType,
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
  companyNotes?: string;
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
  candidate: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    jobSeeker?: {
      phone?: string;
      linkedin?: string;
      currentPosition?: string;
      experienceLevel?: string;
      summary?: string;
    };
  };
  application: {
    id: string;
    status: string;
    coverLetter?: string;
    createdAt: string;
  };
}

export default function InterviewDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const interviewId = params?.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showApproveRescheduleModal, setShowApproveRescheduleModal] =
    useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [rescheduleData, setRescheduleData] = useState({
    scheduledAt: "",
    reason: "",
  });

  const [approveRescheduleData, setApproveRescheduleData] = useState({
    scheduledAt: "",
  });

  const [cancelReason, setCancelReason] = useState("");
  const [newStatus, setNewStatus] = useState("");

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

  const handleReschedule = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/interviews/${interviewId}/reschedule`,
        {
          method: "POST",
          headers: createApiHeaders(user),
          body: JSON.stringify(rescheduleData),
        }
      );

      if (!response.ok) throw new Error("Failed to reschedule");

      toast.success("Interview rescheduled successfully!");
      setShowRescheduleModal(false);
      fetchInterview();
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast.error("Failed to reschedule interview");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveReschedule = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/interviews/${interviewId}/reschedule`,
        {
          method: "POST",
          headers: createApiHeaders(user),
          body: JSON.stringify({
            scheduledAt: approveRescheduleData.scheduledAt,
            reason: "Reschedule request approved",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to approve reschedule");

      toast.success("Reschedule approved! New time set.");
      setShowApproveRescheduleModal(false);
      fetchInterview();
    } catch (error) {
      console.error("Error approving reschedule:", error);
      toast.error("Failed to approve reschedule");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectReschedule = async () => {
    setActionLoading(true);
    try {
      // Reset status back to SCHEDULED and add note
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: "PUT",
        headers: createApiHeaders(user),
        body: JSON.stringify({
          status: "SCHEDULED",
          companyNotes:
            "Reschedule request rejected. Please attend at the original time.",
        }),
      });

      if (!response.ok) throw new Error("Failed to reject reschedule");

      toast.success("Reschedule request rejected");
      fetchInterview();
    } catch (error) {
      console.error("Error rejecting reschedule:", error);
      toast.error("Failed to reject reschedule");
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

  const handleStatusUpdate = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        method: "PUT",
        headers: createApiHeaders(user),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Status updated successfully!");
      setShowStatusModal(false);
      fetchInterview();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
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
              className="text-orange-600 hover:text-orange-700 text-lg"
            >
              🔗 Join Meeting
            </a>
            {interview.meetingPassword && (
              <p className="text-sm text-gray-600 mt-1">
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
      </div>

      {/* Candidate Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Candidate Information
        </h2>
        <div className="flex items-start gap-4 mb-4">
          {interview.candidate.avatarUrl ? (
            <img
              src={interview.candidate.avatarUrl}
              alt={interview.candidate.name}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl font-bold">
              {interview.candidate.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-lg">
              {interview.candidate.name}
            </p>
            <p className="text-gray-600">{interview.candidate.email}</p>
            {interview.candidate.jobSeeker?.phone && (
              <p className="text-gray-600">
                📞 {interview.candidate.jobSeeker.phone}
              </p>
            )}
            {interview.candidate.jobSeeker?.linkedin && (
              <a
                href={interview.candidate.jobSeeker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                🔗 LinkedIn Profile
              </a>
            )}
          </div>
        </div>

        {/* Resume Preview */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Resume</h3>
            <button
              onClick={() =>
                router.push(
                  `/dashboard/company/resume?userId=${interview.candidate.id}`
                )
              }
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              📄 View Full Resume →
            </button>
          </div>
          {interview.candidate.jobSeeker && (
            <div className="space-y-2 text-sm text-gray-700">
              {interview.candidate.jobSeeker.currentPosition && (
                <p>
                  <span className="font-medium">Current Position:</span>{" "}
                  {interview.candidate.jobSeeker.currentPosition}
                </p>
              )}
              {interview.candidate.jobSeeker.experienceLevel && (
                <p>
                  <span className="font-medium">Experience:</span>{" "}
                  {interview.candidate.jobSeeker.experienceLevel}
                </p>
              )}
              {interview.candidate.jobSeeker.summary && (
                <p>
                  <span className="font-medium">Summary:</span>{" "}
                  {interview.candidate.jobSeeker.summary}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {interview.companyNotes && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Internal Notes
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {interview.companyNotes}
          </p>
        </div>
      )}

      {interview.candidateNotes && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Candidate Notes
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {interview.candidateNotes}
          </p>

          {/* Reschedule Request Actions */}
          {interview.status === "RESCHEDULED" &&
            interview.candidateNotes?.includes("Reschedule requested") && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-yellow-700 mb-3">
                  ⚠️ The candidate has requested to reschedule this interview
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveRescheduleModal(true)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✓ Approve & Set New Time
                  </button>
                  <button
                    onClick={handleRejectReschedule}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "Rejecting..." : "✕ Reject Request"}
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Feedback */}
      {interview.feedback && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Feedback</h2>
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

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Status Actions */}
          {interview.status === "SCHEDULED" && (
            <button
              onClick={() => {
                setNewStatus("IN_PROGRESS");
                setShowStatusModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ▶️ Start Interview
            </button>
          )}

          {interview.status === "CONFIRMED" && (
            <>
              <button
                onClick={() => {
                  setNewStatus("IN_PROGRESS");
                  setShowStatusModal(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ▶️ Start Interview
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/company/interviews/${interview.id}/feedback`
                  )
                }
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow"
              >
                📝 Add Feedback
              </button>
            </>
          )}

          {interview.status === "IN_PROGRESS" && (
            <>
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/company/interviews/${interview.id}/feedback`
                  )
                }
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ Complete & Add Feedback
              </button>
              <button
                onClick={() => {
                  setNewStatus("NO_SHOW");
                  setShowStatusModal(true);
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                ❌ Mark as No Show
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Reschedule & Cancel - Available for non-completed interviews */}
          {!["COMPLETED", "CANCELLED", "NO_SHOW"].includes(
            interview.status
          ) && (
            <>
              <button
                onClick={() => setShowRescheduleModal(true)}
                className="px-6 py-3 border-2 border-yellow-500 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                🔄 Reschedule
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 border-2 border-red-500 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                ❌ Cancel
              </button>
            </>
          )}

          <button
            onClick={() =>
              router.push(
                `/dashboard/company/applications/${interview.application.id}`
              )
            }
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📄 View Application
          </button>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reschedule Interview
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={rescheduleData.scheduledAt}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      scheduledAt: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) =>
                    setRescheduleData({
                      ...rescheduleData,
                      reason: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Why are you rescheduling?"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReschedule}
                disabled={actionLoading || !rescheduleData.scheduledAt}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                {actionLoading ? "Rescheduling..." : "Confirm Reschedule"}
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

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Update Interview Status
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to update the status to{" "}
              <span className="font-semibold">
                {newStatus.replace("_", " ")}
              </span>
              ?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleStatusUpdate}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? "Updating..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Reschedule Modal */}
      {showApproveRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Approve Reschedule Request
            </h3>
            <p className="text-gray-600 mb-4">
              Please select a new date and time for this interview.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Date & Time *
              </label>
              <input
                type="datetime-local"
                value={approveRescheduleData.scheduledAt}
                onChange={(e) =>
                  setApproveRescheduleData({
                    ...approveRescheduleData,
                    scheduledAt: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleApproveReschedule}
                disabled={actionLoading || !approveRescheduleData.scheduledAt}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? "Approving..." : "Approve & Schedule"}
              </button>
              <button
                onClick={() => setShowApproveRescheduleModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
