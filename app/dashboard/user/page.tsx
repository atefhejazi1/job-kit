// app/dashboard/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FileText, Briefcase, Edit, Eye, RefreshCw, Plus,ArrowRight, User } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { DeleteCVButton } from "./DeleteCVButton";

export default function UserDashboard() {
  const { resumeData, loadResume, loading } = useResume();
  const [applications] = useState(3);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadResume();
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
              <span className={`text-xs px-2 py-1 rounded-full ${hasCV ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {hasCV ? "Active" : "Not Created"}
              </span>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">Your Resume</h3>
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
              <span className="font-bold text-gray-900 text-2xl">{applications}</span>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">Applications</h3>
            <p className="text-gray-500 text-sm">{"Jobs you've applied to"}</p>
          </div>

          {/* Profile Card */}
          <div className="group hover:shadow-lg p-6 border border-gray-200 rounded-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
             <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-lg transition-colors">
  <User className="w-5 h-5 text-green-600" />
</div>
             <a href="/dashboard/user/profile" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm">
  Edit <ArrowRight className="w-3 h-3" />
</a>
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">Your Profile</h3>
            <p className="text-gray-500 text-sm truncate">{resumeData.email || "No email set"}</p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-gray-200 border-b">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-700" />
              <h2 className="font-semibold text-gray-900 text-lg">Your Resume</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              {hasCV && (
                <>
                  <a
                    href="/dashboard/user/resume-preview"
                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg font-medium text-gray-700 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </a>
                  <a
                    href="/dashboard/user/resume-builder"
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-3 py-2 rounded-lg font-medium text-white text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </a>
                  <DeleteCVButton />
                </>
              )}
            </div>
          </div>

          {hasCV ? (
            <div className="space-y-6 p-6">
              {/* Summary */}
              <div className="gap-6 grid md:grid-cols-2 bg-gray-50 p-5 rounded-lg">
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">Full Name</p>
                  <p className="font-semibold text-gray-900 text-lg">{resumeData.name}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">Email</p>
                  <p className="font-semibold text-gray-900 text-lg">{resumeData.email}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">Phone</p>
                  <p className="font-semibold text-gray-900 text-lg">{resumeData.phone || "—"}</p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-gray-500 text-sm">Skills</p>
                  <p className="font-semibold text-gray-900 text-lg">{resumeData.skills?.length || 0}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                {[
                  { label: 'Education', value: resumeData.education?.length || 0 },
                  { label: 'Experience', value: resumeData.experience?.length || 0 },
                  { label: 'Projects', value: resumeData.projects?.length || 0 },
                  { label: 'Languages', value: resumeData.languages?.length || 0 }
                ].map((stat, i) => (
                  <div key={i} className="hover:shadow-md p-4 border border-gray-200 rounded-lg text-center transition">
                    <p className="mb-1 font-bold text-gray-900 text-3xl">{stat.value}</p>
                    <p className="font-medium text-gray-600 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <FileText className="mx-auto mb-4 w-10 h-10 text-gray-400" />
              <h3 className="mb-2 font-bold text-xl">No Resume Yet</h3>
              <p className="mx-auto mb-6 max-w-md text-gray-500">Create your professional resume now to start applying for jobs</p>
              <a
                href="/dashboard/user/resume-builder"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-lg font-medium text-white transition"
              >
                <Plus className="w-5 h-5" /> Create Resume
              </a>
            </div>
          )}
        </div>

            {/* Job Applications  */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-gray-200 border-b">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-orange-600" />  
              <h2 className="font-semibold text-gray-900 text-lg">Job Applications</h2>
            </div>
         <a href="/dashboard/user/job-applications" className="inline-flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 text-sm">
  View All <ArrowRight className="w-3 h-3" />
</a>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex justify-between items-center hover:bg-gray-50 p-4 border border-gray-200 rounded-lg transition">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">  
                      <Briefcase className="w-5 h-5 text-orange-600" /> 
                    </div>
                    <div>
                      <h3 className="font-semibold">Sample Job {i + 1}</h3>
                      <p className="text-gray-500 text-sm">Applied {i + 1} days ago</p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 px-3 py-1 rounded-full font-medium text-yellow-700 text-sm">Under Review</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}