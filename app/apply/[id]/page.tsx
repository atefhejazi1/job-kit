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
  List, // Added for requirements
  Award, // Added for benefits
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
  const params = useParams();
  const id = params?.id as string;
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
      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
          "x-user-email": user?.email || "",
        },
        credentials: "include",
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            {/* Dark Mode Spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 dark:border-primary/50 border-t-primary dark:border-t-primary/80 mx-auto"></div>
            <Send className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary dark:text-primary-light" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Loading Application...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare everything
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-lg p-12 max-w-md mx-4 border border-gray-200 dark:border-gray-700">
          <div className="bg-red-100 dark:bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Job Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This job posting may have been removed or doesn't exist.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse All Jobs
          </button>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = job.deadline && new Date() > new Date(job.deadline);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary/80 dark:text-primary-light dark:hover:text-primary-light/80 mb-6 font-semibold transition-all transform hover:scale-[1.02]"
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
                    className="w-20 h-20 rounded-xl object-cover mr-4 shadow-md border-2 border-gray-100 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <Building2 className="w-10 h-10 text-primary dark:text-primary-light" />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-primary dark:text-primary-light font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {job.company.companyName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
                  <MapPin className="w-4 h-4 mr-2 text-primary dark:text-primary-light" />
                  {job.location}
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
                  <Clock className="w-4 h-4 mr-2 text-primary dark:text-primary-light" />
                  {job.workType}
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg text-green-700 dark:text-green-300 font-semibold">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salaryMin && job.salaryMax
                      ? `${job.salaryMin} - ${job.salaryMax} ${job.currency}`
                      : job.salaryMin
                      ? `From ${job.salaryMin} ${job.currency}`
                      : `Up to ${job.salaryMax} ${job.currency}`}
                  </div>
                )}
                {job.deadline && (
                  <div className={`flex items-center px-3 py-2 rounded-lg font-medium ${
                    isDeadlinePassed 
                      ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400"
                  }`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {hasApplied ? (
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-6 py-3 rounded-xl flex items-center shadow-md border-2 border-green-200 dark:border-green-800">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span className="font-bold">Already Applied</span>
              </div>
            ) : isDeadlinePassed ? (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-6 py-3 rounded-xl flex items-center shadow-md border-2 border-red-200 dark:border-red-800">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                Job Description
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <List className="w-5 h-5 mt-1 mr-3 text-primary dark:text-primary-light flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Benefits
                </h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Award className="w-5 h-5 mt-1 mr-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Form / Status */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Apply Form */}
              {hasApplied ? (
                <div className="bg-green-50 dark:bg-green-900 rounded-xl shadow-lg dark:shadow-xl p-6 border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-center text-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                      Application Submitted!
                    </h3>
                  </div>
                  <p className="text-green-700 dark:text-green-400 text-center">
                    You have successfully applied for this job. You can view your application status in your dashboard.
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/user/applications")}
                    className="mt-4 w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Go to Applications Dashboard
                  </button>
                </div>
              ) : isDeadlinePassed ? (
                <div className="bg-red-50 dark:bg-red-900 rounded-xl shadow-lg dark:shadow-xl p-6 border border-red-200 dark:border-red-700">
                  <div className="flex items-center justify-center text-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                      Application Closed
                    </h3>
                  </div>
                  <p className="text-red-700 dark:text-red-400 text-center">
                    The deadline for this job application has passed.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-2xl font-bold text-primary dark:text-primary-light mb-4">
                    Submit Your Application
                  </h3>

                  <div className="mb-4">
                    <label
                      htmlFor="coverLetter"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Cover Letter (Required)
                    </label>
                    <textarea
                      id="coverLetter"
                      rows={6}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary dark:focus:border-primary transition-shadow resize-none"
                      placeholder="Tell the company why you are the best fit for this role..."
                      disabled={submitting}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    {submitting ? "Submitting..." : "Apply Now"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}