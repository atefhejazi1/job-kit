"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeaders } from "@/lib/api-utils";
import toast from "react-hot-toast";

interface JobApplication {
  id: string;
  applicantName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: string;
  experience?: string;
  expectedSalary?: number;
  availableFrom?: string;
  notes?: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    workType: string;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
  };
}

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  const applicationId = params?.id as string;

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        headers: createApiHeaders(user),
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
        setNotes(data.application.notes || "");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch application details");
        router.back();
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to fetch application details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: createApiHeaders(user),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Application status updated successfully!");
        fetchApplication();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  const updateNotes = async () => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: createApiHeaders(user),
        body: JSON.stringify({ notes: notes }),
      });

      if (response.ok) {
        toast.success("Notes updated successfully!");
        fetchApplication();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update notes");
      }
    } catch (error) {
      console.error("Error updating notes:", error);
      toast.error("Failed to update notes");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (applicationId && user?.userType === "COMPANY") {
      fetchApplication();
    }
  }, [applicationId, user]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      REVIEWED: "bg-blue-100 text-blue-800",
      SHORTLISTED: "bg-green-100 text-green-800",
      INTERVIEWING: "bg-purple-100 text-purple-800",
      ACCEPTED: "bg-emerald-100 text-emerald-800",
      REJECTED: "bg-red-100 text-red-800",
      WITHDRAWN: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          statusStyles[status as keyof typeof statusStyles] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSalary = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The application you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80 mb-4 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back to Applications</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                {application.applicantName}
              </h1>
              <p className="text-gray-600">
                Applied for {application.job.title}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {application.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <p className="text-gray-900">
                    {application.experience || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Salary
                  </label>
                  <p className="text-gray-900">
                    {application.expectedSalary
                      ? formatSalary(
                          application.expectedSalary,
                          application.job.currency
                        )
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available From
                  </label>
                  <p className="text-gray-900">
                    {application.availableFrom
                      ? new Date(application.availableFrom).toLocaleDateString()
                      : "Immediately"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applied Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(application.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Cover Letter
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume */}
            {application.resumeUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Resume
                </h2>
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Resume.pdf</p>
                    <p className="text-sm text-gray-500">
                      Click to view or download
                    </p>
                  </div>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <p className="text-gray-900">{application.job.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="text-gray-900">{application.job.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Work Type
                  </label>
                  <p className="text-gray-900">
                    {application.job.workType.replace("_", " ")}
                  </p>
                </div>
                {(application.job.salaryMin || application.job.salaryMax) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Salary Range
                    </label>
                    <p className="text-gray-900">
                      {application.job.salaryMin && application.job.salaryMax
                        ? `${formatSalary(
                            application.job.salaryMin,
                            application.job.currency
                          )} - ${formatSalary(
                            application.job.salaryMax,
                            application.job.currency
                          )}`
                        : application.job.salaryMin
                        ? `${formatSalary(
                            application.job.salaryMin,
                            application.job.currency
                          )}+`
                        : `Up to ${formatSalary(
                            application.job.salaryMax!,
                            application.job.currency
                          )}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {application.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus("REVIEWED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={() => updateStatus("SHORTLISTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => updateStatus("REJECTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      Reject Application
                    </button>
                  </>
                )}

                {application.status === "REVIEWED" && (
                  <>
                    <button
                      onClick={() => updateStatus("SHORTLISTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                      Shortlist Candidate
                    </button>
                    <button
                      onClick={() => updateStatus("REJECTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      Reject Application
                    </button>
                  </>
                )}

                {application.status === "SHORTLISTED" && (
                  <>
                    <button
                      onClick={() => updateStatus("INTERVIEWING")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
                    >
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => updateStatus("REJECTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      Reject Application
                    </button>
                  </>
                )}

                {application.status === "INTERVIEWING" && (
                  <>
                    <button
                      onClick={() => updateStatus("ACCEPTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                    >
                      Accept Candidate
                    </button>
                    <button
                      onClick={() => updateStatus("REJECTED")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      Reject Application
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Internal Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this candidate..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
              <button
                onClick={updateNotes}
                disabled={updating}
                className="mt-3 w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
