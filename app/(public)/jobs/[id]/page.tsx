"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Building,
  User,
  LogIn,
  Zap,
} from "lucide-react";
import { Job } from "@/types/job.types";

interface JobWithCompany extends Job {
  company?: {
    id: string;
    companyName: string;
    location?: string;
    logo?: string;
    industry?: string;
  };
}

interface JobDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = React.use(params);
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<JobWithCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const headers = user ? createApiHeadersWithoutContentType(user) : {};
        const response = await fetch(`/api/jobs/${id}`, { headers });
        if (!response.ok) {
          throw new Error("Failed to load job details");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

   
    fetchJobDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 dark:border-slate-700 dark:border-t-orange-500 mx-auto"></div>
              <Briefcase className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Job Details...
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Please wait while we fetch the information
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden animate-pulse">
            <div className="bg-gray-200 dark:bg-slate-700 h-48 w-full"></div>
            <div className="p-8 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-slate-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to jobs
          </Link>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl p-12 text-center">
            <div className="bg-red-100 dark:bg-red-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-red-700 dark:text-red-400 text-lg mb-6">
              {error || "Job not found"}
            </p>
            <Link
              href="/jobs"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Negotiable";
    if (min && max)
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  const isDeadlineApproaching =
    job.deadline &&
    new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 font-semibold transition-colors transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Jobs
        </Link>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-md">
                  {job.title}
                </h1>
                <p className="text-xl text-white font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {job.company?.companyName || "Company Name"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                >
                  <Bookmark
                    className={`w-6 h-6 ${bookmarked ? "fill-current" : ""}`}
                  />
                </button>
                <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <p className="text-black text-xs font-medium mb-1">Posted On</p>
                <p className="font-bold text-black text-sm">
                  {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <p className="text-black text-xs font-medium mb-1">Location</p>
                <p className="font-bold text-black text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <p className="text-black text-xs font-medium mb-1">Job Type</p>
                <p className="font-bold text-black text-sm flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {job.workType}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 hover:bg-opacity-30 transition-all">
                <p className="text-black text-xs font-medium mb-1">
                  Experience
                </p>
                <p className="font-bold text-black text-sm">
                  {job.experienceLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Salary Section */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-400 text-sm">Expected Salary</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                </div>
              </div>
              {job.currency && (
                <p className="text-sm text-gray-500 dark:text-slate-500">
                  Currency: {job.currency}
                </p>
              )}
            </div>

            {/* Deadline Alert */}
            {job.deadline && (
              <div
                className={`mb-8 p-4 rounded-lg flex items-start gap-3 ${
                  isDeadlineApproaching
                    ? "bg-orange-50 border-2 border-orange-200 dark:bg-orange-900 dark:border-orange-700"
                    : "bg-blue-50 border-2 border-blue-200 dark:bg-blue-900 dark:border-blue-700"
                }`}
              >
                <Clock
                  className={`w-5 h-5 mt-1 ${
                    isDeadlineApproaching ? "text-orange-600" : "text-blue-600"
                  }`}
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Application Deadline
                  </p>
                  <p
                    className={
                      isDeadlineApproaching
                        ? "text-orange-700 dark:text-orange-400"
                        : "text-blue-700 dark:text-blue-400"
                    }
                  >
                    {formatDate(job.deadline)}
                    {isDeadlineApproaching && (
                      <span className="ml-2 font-bold">⚠️ Closing Soon</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Job Description
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-slate-300 leading-relaxed">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-orange-600" />
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-slate-700 rounded-lg hover:bg-orange-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <span className="text-orange-600 font-bold mt-1">✓</span>
                      <span className="text-gray-700 dark:text-slate-200">{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600 dark:text-slate-400">
                    No specific requirements listed
                  </li>
                )}
              </ul>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full font-semibold hover:shadow-md transition-all hover:scale-105 cursor-pointer dark:from-slate-700 dark:to-slate-800 dark:text-orange-400"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-slate-400">No specific skills listed</p>
                )}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                    >
                      <span className="text-green-500 text-xl">✨</span>
                      <span className="text-gray-700 dark:text-slate-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info Section */}
            {job.company && (
              <div className="mb-8 pb-8 border-b-2 border-gray-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  About the Company
                </h2>
                <div className="flex gap-4 items-start">
                  {job.company.logo && (
                    <Image
                      src={job.company.logo}
                      alt={job.company.companyName}
                      width={80}
                      height={80}
                      className="rounded-lg bg-white p-1 dark:bg-slate-900"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.company.companyName}
                    </h3>
                    {job.company.industry && (
                      <p className="text-gray-600 dark:text-slate-400 mb-2">
                        <span className="font-semibold">Industry:</span>{" "}
                        {job.company.industry}
                      </p>
                    )}
                    {job.company.location && (
                      <p className="text-gray-600 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.company.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                user?.userType === "USER" ? (
                  <Link
                    href={`/apply/${id}`}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all inline-flex items-center justify-center transform hover:scale-105 ${
                      applied
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl"
                    }`}
                  >
                    {applied ? "✓ Application Submitted" : "Apply Now"}
                  </Link>
                ) : (
                  <div className="flex-1 py-4 px-6 rounded-xl font-bold text-lg bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 inline-flex items-center justify-center">
                    <Building className="w-5 h-5 mr-2" />
                    Companies cannot apply
                  </div>
                )
              ) : (
                <Link
                  href={`/login?returnUrl=${encodeURIComponent(
                    `/apply/${id}`
                  )}`}
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl inline-flex items-center justify-center transform hover:scale-105 transition-all"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Apply
                </Link>
              )}
              <Link
                href="/jobs"
                className="py-4 px-6 rounded-xl font-bold text-lg border-2 border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-slate-700 transition-all transform hover:scale-105"
              >
                View Other Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}