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
  job: {
    title: string;
  };
  candidate: {
    name: string;
  };
  application: {
    id: string;
  };
}

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const interviewId = params?.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    feedback: "",
    rating: 3,
    applicationStatus: "",
  });

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  const fetchInterview = async () => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`, {
        headers: createApiHeadersWithoutContentType(user),
      });
      if (!response.ok) throw new Error("Failed to fetch interview");
      const data = await response.json();
      setInterview(data.interview);
    } catch (error) {
      console.error("Error fetching interview:", error);
      toast.error("Failed to load interview");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.feedback || formData.rating < 1 || formData.rating > 5) {
        toast.error("Please fill in the feedback and rating fields.");
        return;
      }

      const response = await fetch(`/api/interviews/${interviewId}/feedback`, {
        method: "POST",
        headers: createApiHeaders(user),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit feedback");
      }

      toast.success("Feedback submitted successfully!");
      // Navigate back to the interview details page
      router.push(`/dashboard/company/interviews/${interviewId}`);
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
        <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-red-500 dark:text-red-400">Interview not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl dark:bg-gray-900 min-h-screen">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 transition-colors"
      >
        ← Back
      </button>

      {/* Header/Summary Block */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Interview Feedback
        </h1>
        <div className="border-l-4 border-orange-500 pl-4 bg-orange-50 dark:bg-gray-700 p-4 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">Interview</p>
          <p className="font-semibold text-gray-900 dark:text-white">{interview.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Candidate</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {interview.candidate.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Job</p>
          <p className="font-semibold text-gray-900 dark:text-white">{interview.job.title}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl p-6"
      >
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`text-4xl transition-transform transform ${
                  star <= formData.rating
                    ? "text-yellow-400 scale-110 hover:scale-125"
                    : "text-gray-300 dark:text-gray-600 hover:text-yellow-300 dark:hover:text-yellow-400"
                }`}
              >
                ⭐
              </button>
            ))}
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              ({formData.rating}/5)
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            1 = Poor, 2 = Fair, 3 = Good, 4 = Very Good, 5 = Excellent
          </p>
        </div>

        {/* Feedback */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Interview Feedback <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.feedback}
            onChange={(e) =>
              setFormData({ ...formData, feedback: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            rows={8}
            placeholder="Provide detailed feedback about the candidate's performance, strengths, areas for improvement, technical skills, communication, etc."
            required
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This feedback will be stored internally and can be shared with the
            candidate at your discretion.
          </p>
        </div>

        {/* Application Status Update */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Update Application Status
          </label>
          <select
            value={formData.applicationStatus}
            onChange={(e) =>
              setFormData({ ...formData, applicationStatus: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none"
          >
            <option value="">-- Keep Current Status --</option>
            <option value="INTERVIEWING">Continue Interviewing (Next Stage)</option>
            <option value="ACCEPTED">Accepted (Make Offer)</option>
            <option value="REJECTED">Rejected</option>
            <option value="SHORTLISTED">Move to Shortlist</option>
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Optionally update the application status based on the interview
            outcome.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>

      {/* Tips Block */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
          💡 Tips for Effective Feedback
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Be specific and provide examples.</li>
          <li>Focus on both strengths and areas for improvement.</li>
          <li>Comment on technical skills, communication, and cultural fit.</li>
          <li>Keep feedback professional and constructive.</li>
          <li>Include any relevant observations or concerns.</li>
        </ul>
      </div>
    </div>
  );
}