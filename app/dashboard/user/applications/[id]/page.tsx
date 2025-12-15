"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeaders } from "@/lib/api-utils";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  FileText,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface JobApplication {
  id: string;
  status: string;
  coverLetter?: string;
  resumeUrl?: string;
  experience?: string;
  expectedSalary?: number;
  availableFrom?: string;
  createdAt: string;
  updatedAt: string;
  resume?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    summary: string;
    skills: string[];
    experience: any[];
    education: any[];
    projects: any[];
    languages: any[];
    certifications?: any[];
    createdAt: string;
    updatedAt: string;
  };
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    workType: string;
    salaryMin?: number;
    salaryMax?: number;
    currency: string;
    company?: {
      companyName: string;
      location: string;
      logo?: string;
      website?: string;
    };
  };
}

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: any;
    bgColor: string;
    darkBgColor: string;
    darkColor: string;
  }
> = {
  PENDING: {
    label: "Pending Review",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    darkBgColor: "dark:bg-yellow-900/30",
    darkColor: "dark:text-yellow-300",
    icon: Clock,
  },
  REVIEWED: {
    label: "Reviewed",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    darkBgColor: "dark:bg-blue-900/30",
    darkColor: "dark:text-blue-300",
    icon: Eye,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    darkBgColor: "dark:bg-purple-900/30",
    darkColor: "dark:text-purple-300",
    icon: CheckCircle,
  },
  INTERVIEWING: {
    label: "Interviewing",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    darkBgColor: "dark:bg-indigo-900/30",
    darkColor: "dark:text-indigo-300",
    icon: Briefcase,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-green-700",
    bgColor: "bg-green-100",
    darkBgColor: "dark:bg-green-900/30",
    darkColor: "dark:text-green-300",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-100",
    darkBgColor: "dark:bg-red-900/30",
    darkColor: "dark:text-red-300",
    icon: XCircle,
  },
  WITHDRAWN: {
    label: "Withdrawn",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    darkBgColor: "dark:bg-gray-700",
    darkColor: "dark:text-gray-300",
    icon: AlertCircle,
  },
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);

  const applicationId = params?.id as string;

  useEffect(() => {
    if (user && applicationId) {
      fetchApplication();
    }
  }, [user, applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        headers: createApiHeaders(user),
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch application details");
        router.push("/dashboard/user/applications");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to fetch application details");
      router.push("/dashboard/user/applications");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 dark:border-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Application not found
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push("/dashboard/user/applications")}
          >
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[application.status] || statusConfig.PENDING;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard/user/applications")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Applications</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {application.job.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 flex-wrap">
                {application.job.company && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{application.job.company.companyName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{application.job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{application.job.workType}</span>
                </div>
              </div>
            </div>
            {application.job.company?.logo && (
              <img
                src={application.job.company.logo}
                alt={application.job.company.companyName}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor} ${statusInfo.darkBgColor}`}
          >
            <StatusIcon
              className={`w-5 h-5 ${statusInfo.color} ${statusInfo.darkColor}`}
            />
            <span
              className={`font-medium ${statusInfo.color} ${statusInfo.darkColor}`}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Application Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Application Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Application Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Applied On
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(application.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {new Date(application.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {application.expectedSalary && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Expected Salary
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {application.job.currency}{" "}
                    {application.expectedSalary.toLocaleString()}
                  </p>
                </div>
              )}
              {application.availableFrom && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Available From
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(application.availableFrom).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Job Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Job Details
            </h2>
            <div className="space-y-4">
              {(application.job.salaryMin || application.job.salaryMax) && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Salary Range
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {application.job.currency}{" "}
                    {application.job.salaryMin?.toLocaleString() || "N/A"} -{" "}
                    {application.job.salaryMax?.toLocaleString() || "N/A"}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Work Type
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {application.job.workType}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Location
                </label>
                <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {application.job.location}
                </p>
              </div>
              {application.job.company?.website && (
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Company Website
                  </label>
                  <a
                    href={application.job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium flex items-center gap-2"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        {application.coverLetter && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Cover Letter
            </h2>
            <div className="prose max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {application.coverLetter}
            </div>
          </div>
        )}

        {/* Resume */}
        {application.resume && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resume
            </h2>

            {/* Basic Info */}
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {application.resume.name}
              </h3>
              <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                <p>{application.resume.email}</p>
                <p>{application.resume.phone}</p>
              </div>
            </div>

            {/* Summary */}
            {application.resume.summary && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                  Professional Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {application.resume.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {application.resume.skills &&
              Array.isArray(application.resume.skills) &&
              application.resume.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.resume.skills.map(
                      (skill: any, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                        >
                          {typeof skill === "string"
                            ? skill
                            : skill.name || skill.skill || ""}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Experience */}
            {application.resume.experience &&
              Array.isArray(application.resume.experience) &&
              application.resume.experience.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {application.resume.experience.map(
                      (exp: any, index: number) => (
                        <div
                          key={index}
                          className="border-l-2 border-orange-500 pl-4"
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exp.role || exp.title || ""}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.company || ""}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                            {exp.startDate || ""} -{" "}
                            {exp.endDate || exp.current ? "Present" : ""}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Education */}
            {application.resume.education &&
              Array.isArray(application.resume.education) &&
              application.resume.education.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Education
                  </h3>
                  <div className="space-y-3">
                    {application.resume.education.map(
                      (edu: any, index: number) => (
                        <div key={index}>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {edu.degree || ""}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {edu.school || edu.institution || ""}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {edu.year || edu.graduationYear || ""}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Projects */}
            {application.resume.projects &&
              Array.isArray(application.resume.projects) &&
              application.resume.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Projects
                  </h3>
                  <div className="space-y-3">
                    {application.resume.projects.map(
                      (project: any, index: number) => (
                        <div key={index}>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {project.title || project.name || ""}
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {project.description || ""}
                          </p>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Languages */}
            {application.resume.languages &&
              Array.isArray(application.resume.languages) &&
              application.resume.languages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {application.resume.languages.map(
                      (lang: any, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                        >
                          {typeof lang === "string"
                            ? lang
                            : `${lang.language || lang.name || ""} - ${
                                lang.proficiency || lang.level || ""
                              }`}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Certifications */}
            {application.resume.certifications &&
              Array.isArray(application.resume.certifications) &&
              application.resume.certifications.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                    Certifications
                  </h3>
                  <div className="space-y-2">
                    {application.resume.certifications.map(
                      (cert: any, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {cert.title || cert.name || ""}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {cert.issuer || ""}{" "}
                              {cert.year ? `- ${cert.year}` : ""}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link href={`/jobs/${application.job.id}`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Job Posting
            </Button>
          </Link>
          <Button
            variant="primary"
            onClick={() => router.push("/dashboard/user/applications")}
          >
            Back to Applications
          </Button>
        </div>
      </div>
    </div>
  );
}
