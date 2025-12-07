"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createApiHeadersWithoutContentType,
  createApiHeaders,
} from "@/lib/api-utils";
import toast from "react-hot-toast";

interface Application {
  id: string;
  status: string;
  coverLetter?: string;
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
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    jobSeeker?: {
      phone?: string;
      skills: string[];
    };
  };
}

export default function ScheduleInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const applicationId = params?.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    interviewType: "VIDEO_CALL",
    scheduledAt: "",
    duration: 60,
    meetingLink: "",
    meetingPassword: "",
    location: "",
    companyNotes: "",
  });

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        headers: createApiHeadersWithoutContentType(user),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch application");
      }
      const data = await response.json();
      setApplication(data.application);

      // Set default title
      setFormData((prev) => ({
        ...prev,
        title: `Interview for ${data.application.job.title}`,
      }));
    } catch (error: any) {
      console.error("Error fetching application:", error);
      toast.error(error.message || "Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.scheduledAt) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate meeting link for video/phone calls
      if (
        (formData.interviewType === "VIDEO_CALL" ||
          formData.interviewType === "PHONE_CALL") &&
        !formData.meetingLink
      ) {
        toast.error(
          "Meeting link is required for video and phone call interviews"
        );
        return;
      }

      // Validate location for in-person interviews
      if (formData.interviewType === "IN_PERSON" && !formData.location) {
        toast.error("Location is required for in-person interviews");
        return;
      }

      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: createApiHeaders(user),
        body: JSON.stringify({
          ...formData,
          applicationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to schedule interview");
      }

      toast.success("Interview scheduled successfully!");
      router.push("/dashboard/company/interviews");
    } catch (error: any) {
      console.error("Error scheduling interview:", error);
      toast.error(error.message || "Failed to schedule interview");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Application not found</p>
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

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Schedule Interview
        </h1>
        <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded">
          <p className="text-sm text-gray-600">Candidate</p>
          <p className="font-semibold text-gray-900">{application.user.name}</p>
          <p className="text-sm text-gray-600">{application.user.email}</p>
          <p className="text-sm text-gray-600 mt-2">Job</p>
          <p className="font-semibold text-gray-900">{application.job.title}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        {/* Interview Title */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Interview Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g., Technical Interview Round 1"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
            placeholder="Brief description of what will be covered in this interview"
          />
        </div>

        {/* Interview Type */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Interview Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.interviewType}
            onChange={(e) =>
              setFormData({ ...formData, interviewType: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="VIDEO_CALL">🎥 Video Call</option>
            <option value="PHONE_CALL">📞 Phone Call</option>
            <option value="IN_PERSON">🏢 In Person</option>
            <option value="ASSESSMENT">📝 Assessment</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Scheduled Date & Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) =>
                setFormData({ ...formData, scheduledAt: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              min={15}
              max={480}
              required
            />
          </div>
        </div>

        {/* Meeting Link (for VIDEO_CALL and PHONE_CALL) */}
        {(formData.interviewType === "VIDEO_CALL" ||
          formData.interviewType === "PHONE_CALL") && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Meeting Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData({ ...formData, meetingLink: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., https://meet.google.com/xxx-xxxx-xxx"
              required
            />
          </div>
        )}

        {/* Meeting Password */}
        {(formData.interviewType === "VIDEO_CALL" ||
          formData.interviewType === "PHONE_CALL") && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Meeting Password (optional)
            </label>
            <input
              type="text"
              value={formData.meetingPassword}
              onChange={(e) =>
                setFormData({ ...formData, meetingPassword: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Meeting password"
            />
          </div>
        )}

        {/* Location (for IN_PERSON) */}
        {formData.interviewType === "IN_PERSON" && (
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Office address or meeting location"
              required
            />
          </div>
        )}

        {/* Company Notes */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Internal Notes (not visible to candidate)
          </label>
          <textarea
            value={formData.companyNotes}
            onChange={(e) =>
              setFormData({ ...formData, companyNotes: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            rows={3}
            placeholder="Internal notes or reminders for your team"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Scheduling..." : "Schedule Interview"}
          </button>
        </div>
      </form>
    </div>
  );
}
