"use client";

import React, { useState, useEffect } from "react";
import { Heart, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import JobListView from "@/components/JobListView";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

interface SavedJob {
  id: string;
  jobId: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    workType: string;
    salaryMin: number;
    salaryMax: number;
    currency: string;
    company: {
      id: string;
      companyName: string;
      logo?: string;
      location: string;
    };
  };
}

interface SavedJobsResponse {
  jobs: SavedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.id) {
      fetchSavedJobs(currentPage);
    }
  }, [user?.id, currentPage]);

  const fetchSavedJobs = async (page: number) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/saved-jobs?page=${page}&limit=${itemsPerPage}`,
        {
          headers: {
            "x-user-id": user.id,
          },
        }
      );
      const data: SavedJobsResponse = await res.json();
      setSavedJobs(data.jobs);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedJob = async (jobId: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/saved-jobs?jobId=${jobId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
        },
      });

      if (res.ok) {
        setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  return (
    // Main Container Background
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Saved Jobs
            </h1>
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            {total} job{total !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center dark:bg-gray-800 dark:shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-gray-400">
              Loading saved jobs...
            </p>
          </div>
        ) : savedJobs.length > 0 ? (
          <>
            {/* Jobs List */}
            <div className="space-y-4 mb-8">
              {savedJobs.map((savedJob) => (
                <div
                  key={savedJob.id}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 p-6 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-red-50/30
                    dark:bg-gray-800 dark:border-gray-700 dark:hover:border-primary-400 dark:hover:from-gray-700/50 dark:hover:to-gray-700/50"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {savedJob.job.company?.logo ? (
                        <img
                          src={savedJob.job.company.logo}
                          alt={savedJob.job.company.companyName}
                          className="w-14 h-14 rounded-lg object-cover border border-gray-200 group-hover:scale-110 transition-transform duration-300 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center dark:from-orange-900/50 dark:to-red-900/50">
                          <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                    </div>

                    {/* Job Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-1 dark:text-white dark:group-hover:text-primary">
                            {savedJob.job.title}
                          </h3>
                          <p className="text-gray-600 text-sm font-medium dark:text-gray-400">
                            {savedJob.job.company?.companyName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Saved on{" "}
                            {new Date(savedJob.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <div>📍 {savedJob.job.location}</div>
                        <div>💼 {savedJob.job.workType}</div>
                        {savedJob.job.salaryMin || savedJob.job.salaryMax ? (
                          <div>
                            💰 ${savedJob.job.salaryMin || 0} - ${savedJob.job
                              .salaryMax || "N/A"}
                          </div>
                        ) : null}
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2 dark:text-gray-300">
                        {savedJob.job.description}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {/* View Details Button (Primary gradient) */}
                        <Link
                          href={`/jobs/${savedJob.job.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm shadow-sm hover:shadow-md"
                        >
                          View Details
                        </Link>
                        {/* Remove Button (Red outline/fill) */}
                        <button
                          onClick={() => handleRemoveSavedJob(savedJob.job.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm border border-red-200 hover:border-red-300 flex items-center gap-2
                            dark:bg-gray-900 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mb-8">
                {/* Assuming Button component is dark mode compatible, otherwise use default styles below */}
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  // Fallback dark mode styles if Button component is not fully dark mode compatible
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:dark:text-gray-600"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition text-sm font-medium
                          ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <Button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                  // Fallback dark mode styles
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:dark:text-gray-600"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center dark:bg-gray-800 dark:shadow-xl">
            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2 dark:text-white">
              No Saved Jobs
            </h3>
            <p className="text-slate-600 mb-6 dark:text-gray-400">
              You haven't saved any jobs yet. Start exploring and save jobs you're
              interested in!
            </p>
            <Link
              href="/jobs/search"
              className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}