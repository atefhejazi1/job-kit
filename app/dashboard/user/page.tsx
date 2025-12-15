"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Briefcase,
  Edit,
  RefreshCw,
  Plus,
  ArrowRight,
  User,
} from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { ApplicationCard } from "@/components/ApplicationCard";
import CertificationList from "@/components/dashboard/resumeForm/CertificationList ";
import Link from "next/link";

interface JobApplication {
  id: string;
  status:
    | "PENDING"
    | "REVIEWED"
    | "SHORTLISTED"
    | "INTERVIEWING"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
  createdAt: string;
  job: {
    title: string;
    location: string;
    company: {
      companyName: string;
      location: string;
      logo?: string;
    };
  };
}

export default function UserDashboard() {
  const { resumeData, loadResume, loading } = useResume();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadResume();

    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (user?.id) {
      const headers = { "x-user-id": user.id };
      fetch("/api/job-applications", {
        headers,
      })
        .then((r) => r.json())
        .then((data: JobApplication[]) => {
          setApplications(Array.isArray(data) ? data.slice(0, 5) : []);
        });
    }
  }, [loadResume]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadResume();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="border-2 border-black/10 border-t-black rounded-full w-8 h-8 animate-spin dark:border-white/10 dark:border-t-white"></div>
      </div>
    );
  }

  const hasCV = resumeData.name || resumeData.email;

  return (
    <div className="bg-white min-h-screen dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="border-gray-100 border-b dark:border-gray-800">
        <div className="mx-auto px-8 py-10 max-w-5xl">
          <h1 className="font-bold text-gray-900 text-4xl tracking-tight dark:text-white">
            Welcome, {resumeData.name || "User"}
          </h1>
          <p className="mt-2 text-gray-500 text-lg dark:text-gray-400">
            Manage your Resume and track your Job Applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12 mx-auto px-8 py-10 max-w-5xl">
        {/* Stats */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          {/* Resume Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-xl dark:hover:shadow-gray-700/50">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-lg transition-colors dark:bg-gray-700 dark:group-hover:bg-gray-600">
                <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  hasCV
                    ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {hasCV ? "Active" : "Not Created"}
              </span>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">My Resume</h3>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {hasCV ? "Last updated: Today" : "Create your first resume"}
            </p>
          </div>

          {/* Applications Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-xl dark:hover:shadow-gray-700/50">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-100 group-hover:bg-orange-200 p-2 rounded-lg transition-colors dark:bg-orange-900/30 dark:group-hover:bg-orange-900/50">
                <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-bold text-gray-900 text-2xl dark:text-white">
                {applications.length}
              </span>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
              My Applications
            </h3>
            <p className="text-gray-500 text-sm dark:text-gray-400">{"Jobs you've applied to"}</p>
          </div>

          {/* Profile Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-xl dark:hover:shadow-gray-700/50">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-lg transition-colors dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <Link
                href="/dashboard/user/profile"
                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm dark:text-gray-400 dark:hover:text-white"
              >
                Edit <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">My Profile</h3>
            <p className="text-gray-500 text-sm truncate dark:text-gray-400">
              {resumeData.email || "No email set"}
            </p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-center p-6 border-gray-200 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="font-semibold text-gray-900 text-lg dark:text-white">My Resume</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors dark:hover:bg-gray-700"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-600 dark:text-gray-400 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
              {hasCV && (
                <div className="group relative">
                  <Link
                    href="/dashboard/user/resume-editor"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-white text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Manage Resume</span>
                  </Link>

                  {/* Tooltip */}
                  <div className="hidden group-hover:block top-full -right-4 z-10 absolute bg-linear-to-r from-blue-50 to-blue-100 shadow-sm mt-3 px-2 py-2 border-blue-600 border-l-4 rounded-r-lg text-blue-900 text-xs whitespace-nowrap dark:bg-blue-900 dark:from-blue-900 dark:to-blue-800 dark:border-blue-400 dark:text-blue-100">
                    Preview • Edit • Delete • Export PDF
                  </div>
                </div>
              )}
            </div>
          </div>

          {hasCV ? (
            <div className="space-y-6 p-6">
              {/* Summary */}
              <div className="gap-6 grid md:grid-cols-2 bg-gray-50 p-5 rounded-lg dark:bg-gray-700">
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="font-semibold text-gray-900 text-lg dark:text-white">
                    {resumeData.name}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-semibold text-gray-900 text-lg dark:text-white">
                    {resumeData.email}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900 text-lg dark:text-white">
                    {resumeData.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm dark:text-gray-400">
                    Skills
                  </p>
                  <p className="font-semibold text-gray-900 text-lg dark:text-white">
                    {resumeData.skills?.length || 0}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="gap-4 grid grid-cols-2 md:grid-cols-5">
                {[
                  {
                    label: "Education",
                    value: resumeData.education?.length || 0,
                  },
                  {
                    label: "Certificates",
                    value: resumeData.certifications?.length || 0,
                  },
                  {
                    label: "Experience",
                    value: resumeData.experience?.length || 0,
                  },
                  {
                    label: "Projects",
                    value: resumeData.projects?.length || 0,
                  },
                  {
                    label: "Languages",
                    value: resumeData.languages?.length || 0,
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="hover:shadow-md p-4 border border-gray-200 rounded-lg text-center transition dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
                  >
                    <p className="mb-1 font-bold text-gray-900 text-3xl dark:text-white">
                      {stat.value}
                    </p>
                    <p className="font-medium text-gray-600 text-sm dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <FileText className="mx-auto mb-4 w-10 h-10 text-gray-400 dark:text-gray-500" />
              <h3 className="mb-2 font-bold text-xl dark:text-white">No Resume Yet</h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
                Create your professional resume now to start applying for jobs
              </p>
              <Link
                href="/dashboard/user/resume-builder"
                className="inline-flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-lg font-medium text-white transition dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" /> Create Resume
              </Link>
            </div>
          )}
        </div>

        {/* Job Applications  */}
        <div className="border border-gray-200 rounded-xl overflow-hidden dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-between items-center p-6 border-gray-200 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="font-semibold text-gray-900 text-lg dark:text-white">
                My Job Applications
              </h2>
            </div>
            <Link
              href="/dashboard/user/applications"
              className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 text-sm dark:text-gray-400 dark:hover:text-white"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-6">
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    applicationId={app.id}
                    title={app.job.title}
                    company={app.job.company.companyName}
                    location={app.job.company.location}
                    status={app.status}
                    appliedAt={app.createdAt}
                    logo={app.job.company?.logo}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-3 w-10 h-10 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">No applications yet</p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-blue-600 mt-4 px-4 py-2 rounded-lg font-medium text-white text-sm dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}