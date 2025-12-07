"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  workType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills: string[];
  deadline?: string;
  requirements: string[];
  benefits: string[];
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    logo?: string;
    location?: string;
    industry?: string;
    description?: string;
  };
}

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.userType === "COMPANY") {
      toast.error("Companies cannot apply for jobs");
      router.push("/dashboard/company");
      return;
    }

    fetchJob();
  }, [id, user, router]);

  const fetchJob = async () => {
    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch(`/api/jobs/${id}`, { headers });

      if (!response.ok) {
        throw new Error("Job not found");
      }

      const jobData = await response.json();
      setJob(jobData);

      // Check if user already applied
      const applicationsResponse = await fetch("/api/job-applications", {
        headers,
      });
      if (applicationsResponse.ok) {
        const applications = await applicationsResponse.json();
        const alreadyApplied = applications.some(
          (app: any) => app.jobId === id
        );
        setHasApplied(alreadyApplied);
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Job not found");
      router.push("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    setSubmitting(true);
    try {
      const headers = createApiHeadersWithoutContentType(user);
      headers["Content-Type"] = "application/json";

      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers,
        body: JSON.stringify({
          jobId: id,
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      setHasApplied(true);

      // Redirect to user dashboard
      setTimeout(() => {
        router.push("/dashboard/user/applications");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
            <Send className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Application...
          </h3>
          <p className="text-gray-600">
            Please wait while we prepare everything
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-4">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This job posting may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = job.deadline && new Date() > new Date(job.deadline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6 font-semibold transition-all transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Job Details
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                {job.company.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.companyName}
                    className="w-20 h-20 rounded-xl object-cover mr-4 shadow-md border-2 border-orange-100"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <Building2 className="w-10 h-10 text-orange-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-orange-600 font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {job.company.companyName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center bg-orange-50 px-3 py-2 rounded-lg text-orange-700 font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center bg-orange-50 px-3 py-2 rounded-lg text-orange-700 font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  {job.workType}
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg text-green-700 font-semibold">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salaryMin && job.salaryMax
                      ? `${job.salaryMin} - ${job.salaryMax} ${job.currency}`
                      : job.salaryMin
                      ? `From ${job.salaryMin} ${job.currency}`
                      : `Up to ${job.salaryMax} ${job.currency}`}
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center bg-red-50 px-3 py-2 rounded-lg text-red-700 font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {hasApplied ? (
              <div className="bg-green-100 text-green-800 px-6 py-3 rounded-xl flex items-center shadow-md border-2 border-green-200">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-bold">Already Applied</span>
              </div>
            ) : isDeadlinePassed ? (
              <div className="bg-red-100 text-red-800 px-6 py-3 rounded-xl flex items-center shadow-md border-2 border-red-200">
                <AlertCircle className="w-6 h-6 mr-2" />
                <span className="font-bold">Deadline Passed</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                Job Description
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <span className="text-orange-600 font-bold mr-3 mt-0.5">
                        ✓
                      </span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-semibold hover:shadow-md transition-all hover:scale-105 cursor-pointer"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <span className="text-green-600 font-bold text-xl mr-3">
                        ✨
                      </span>
                      <span className="text-gray-700 mt-0.5">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Company Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-orange-100 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-orange-600" />
                  About the Company
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-900">Company:</span>
                    <p className="text-gray-600">{job.company.companyName}</p>
                  </div>
                  {job.company.industry && (
                    <div>
                      <span className="font-medium text-gray-900">
                        Industry:
                      </span>
                      <p className="text-gray-600">{job.company.industry}</p>
                    </div>
                  )}
                  {job.company.location && (
                    <div>
                      <span className="font-medium text-gray-900">
                        Location:
                      </span>
                      <p className="text-gray-600">{job.company.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Form */}
              {!hasApplied && !isDeadlinePassed && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-xl p-6 border-2 border-orange-200">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <Send className="w-6 h-6 text-orange-600" />
                    Apply Now
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="coverLetter"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Cover Letter *
                      </label>
                      <textarea
                        id="coverLetter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Tell us why you're the perfect fit for this role..."
                        rows={10}
                        className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white shadow-sm"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {coverLetter.length}/2000 characters
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !coverLetter.trim()}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
                    >
                      {submitting ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {submitting
                        ? "Submitting Application..."
                        : "Submit Application"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
