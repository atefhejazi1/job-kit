"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Zap,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
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
  id: string;
}

export default function JobDetailsPage({ id }: JobDetailsPageProps) {
  const [job, setJob] = useState<JobWithCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to load job details");
        }
        const data = await response.json();
        setJob(data.jobs?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to jobs
          </Link>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-800 font-semibold text-lg">
              {error || "Job not found"}
            </p>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to jobs
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{job.title}</h1>
                <p className="text-lg text-blue-100 font-semibold">
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

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="text-black text-xs font-medium opacity-80">
                  Posted On
                </p>
                <p className="font-bold text-black text-base mt-1">
                  {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="text-black text-xs font-medium opacity-80">
                  Location
                </p>
                <p className="font-bold text-black text-base flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="text-black text-xs font-medium opacity-80">
                  Job Type
                </p>
                <p className="font-bold text-black text-base flex items-center gap-1 mt-1">
                  <Briefcase className="w-4 h-4" />
                  {job.workType}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-3">
                <p className="text-black text-xs font-medium opacity-80">
                  Experience
                </p>
                <p className="font-bold text-black text-base mt-1">
                  {job.experienceLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Salary Section */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Expected Salary</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                </div>
              </div>
              {job.currency && (
                <p className="text-sm text-gray-500">
                  Currency: {job.currency}
                </p>
              )}
            </div>

            {/* Deadline Alert */}
            {job.deadline && (
              <div
                className={`mb-8 p-4 rounded-lg flex items-start gap-3 ${
                  isDeadlineApproaching
                    ? "bg-orange-50 border-2 border-orange-200"
                    : "bg-blue-50 border-2 border-blue-200"
                }`}
              >
                <Clock
                  className={`w-5 h-5 mt-1 ${
                    isDeadlineApproaching ? "text-orange-600" : "text-blue-600"
                  }`}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    Application Deadline
                  </p>
                  <p
                    className={
                      isDeadlineApproaching
                        ? "text-orange-700"
                        : "text-blue-700"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold mt-1">✓</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600">
                    No specific requirements listed
                  </li>
                )}
              </ul>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full font-semibold hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">No specific skills listed</p>
                )}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Benefits
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-green-500 text-xl">✨</span>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info Section */}
            {job.company && (
              <div className="mb-8 pb-8 border-b-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About the Company
                </h2>
                <div className="flex gap-4 items-start">
                  {job.company.logo && (
                    <Image
                      src={job.company.logo}
                      alt={job.company.companyName}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.company.companyName}
                    </h3>
                    {job.company.industry && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-semibold">Industry:</span>{" "}
                        {job.company.industry}
                      </p>
                    )}
                    {job.company.location && (
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.company.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link
                href={`/apply/${params.id}`}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all inline-flex items-center justify-center ${
                  applied
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                }`}
                onClick={() => setApplied(false)}
              >
                {applied ? "✓ Application Submitted" : "Apply Now"}
              </Link>
              <Link
                href="/"
                className="py-4 px-6 rounded-xl font-bold text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
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
