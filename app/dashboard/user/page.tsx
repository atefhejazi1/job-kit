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

    // Fetch 3 recent applications
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
      <div className="flex justify-center items-center h-screen">
        <div className="border-2 border-black/10 border-t-black rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  const hasCV = resumeData.name || resumeData.email;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-gray-100 border-b">
        <div className="mx-auto px-8 py-10 max-w-5xl">
          <h1 className="font-bold text-gray-900 text-4xl tracking-tight">
            Welcome, {resumeData.name || "User"}
          </h1>
          <p className="mt-2 text-gray-500 text-lg">
            Manage your Resume and track your Job Applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12 mx-auto px-8 py-10 max-w-5xl">
        {/* Stats */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          {/* Resume Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-lg transition-colors">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  hasCV
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {hasCV ? "Active" : "Not Created"}
              </span>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">My Resume</h3>
            <p className="text-gray-500 text-sm">
              {hasCV ? "Last updated: Today" : "Create your first resume"}
            </p>
          </div>

          {/* Applications Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-orange-100 group-hover:bg-orange-200 p-2 rounded-lg transition-colors">
                <Briefcase className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-bold text-gray-900 text-2xl">
                {applications.length}
              </span>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">
              My Applications
            </h3>
            <p className="text-gray-500 text-sm">{"Jobs you've applied to"}</p>
          </div>

          {/* Profile Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-lg transition-colors">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <Link
                href="/dashboard/user/profile"
                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm"
              >
                Edit <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">My Profile</h3>
            <p className="text-gray-500 text-sm truncate">
              {resumeData.email || "No email set"}
            </p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-gray-200 border-b">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="font-semibold text-gray-900 text-lg">My Resume</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-600 ${
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
                  <div className="hidden group-hover:block top-full -right-4 z-10 absolute bg-linear-to-r from-blue-50 to-blue-100 shadow-sm mt-3 px-2 py-2 border-blue-600 border-l-4 rounded-r-lg text-blue-900 text-xs whitespace-nowrap">
                    Preview • Edit • Delete • Export PDF
                  </div>
                </div>
              )}
            </div>
          </div>

          {hasCV ? (
            <div className="space-y-6 p-6">
              {/* Summary */}
              <div className="gap-6 grid md:grid-cols-2 bg-gray-50 p-5 rounded-lg">
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">
                    Full Name
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {resumeData.name}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">
                    Email
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {resumeData.email}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {resumeData.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">
                    Skills
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">
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
                    className="hover:shadow-md p-4 border border-gray-200 rounded-lg text-center transition"
                  >
                    <p className="mb-1 font-bold text-gray-900 text-3xl">
                      {stat.value}
                    </p>
                    <p className="font-medium text-gray-600 text-sm">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <FileText className="mx-auto mb-4 w-10 h-10 text-gray-400" />
              <h3 className="mb-2 font-bold text-xl">No Resume Yet</h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500">
                Create your professional resume now to start applying for jobs
              </p>
              <Link
                href="/dashboard/user/resume-builder"
                className="inline-flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-lg font-medium text-white transition"
              >
                <Plus className="w-5 h-5" /> Create Resume
              </Link>
            </div>
          )}
        </div>

        {/* Job Applications  */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-gray-200 border-b">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900 text-lg">
                My Job Applications
              </h2>
            </div>
            <Link
              href="/dashboard/user/applications"
              className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 text-sm"
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
                <FileText className="mx-auto mb-3 w-10 h-10 text-gray-400" />
                <p className="text-gray-500">No applications yet</p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-blue-600 mt-4 px-4 py-2 rounded-lg font-medium text-white text-sm"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mx-auto px-4 py-8 max-w-4xl container">
      <h2 className="font-semibold text-gray-900 text-lg">My certificates</h2>
        <div className="mt-8">
        <CertificationList certifications={resumeData.certifications} />
      </div>
      </div>
      </div>
    </div>
  );
}
