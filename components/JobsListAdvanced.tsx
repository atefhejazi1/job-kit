"use client";

import React, { useEffect, useState } from "react";
import JobListView from "./JobListView";
import JobCard from "./JobCard";
import { Job } from "@/types/job.types";
import { Grid3X3, List, LayoutGrid } from "lucide-react";

interface JobsListAdvancedProps {
  limit?: number;
  showMore?: boolean;
  title?: string;
  description?: string;
  allowViewToggle?: boolean;
  defaultView?: "list" | "grid";
}

const JobsListAdvanced: React.FC<JobsListAdvancedProps> = ({
  limit = 6,
  showMore = true,
  title = "Latest Job Openings",
  description = "Explore the best job opportunities available",
  allowViewToggle = false,
  defaultView = "list",
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">(defaultView);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/jobs?page=1&limit=${limit}`);

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs || []);
        setHasMore((data.total || 0) > limit);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {title}
                </h2>
                <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800 rounded-xl p-8">
            <p className="text-red-800 dark:text-red-400 font-semibold text-lg">
              ⚠️ Failed to load jobs
            </p>
            <p className="text-red-700 dark:text-red-500 mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {title}
                </h2>
                <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            </div>
          )}

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 border-2 border-orange-200 dark:border-gray-700 rounded-xl p-8 text-center shadow-lg">
            <div className="text-6xl mb-4 animate-float">📭</div>
            <p className="text-orange-800 dark:text-orange-400 font-semibold text-lg mb-2">
              No jobs available at the moment
            </p>
            <p className="text-orange-700 dark:text-gray-400 mb-4">
              Check back soon for new opportunities!
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {(title || description) && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {title}
              </h2>
              <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* View Toggle */}
        {allowViewToggle && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg bg-white dark:bg-gray-800 p-1 shadow-md border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
                List View
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid View
              </button>
            </div>
          </div>
        )}

        {/* Jobs Display */}
        {viewMode === "list" ? (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <JobListView job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {showMore && hasMore && (
          <div className="text-center mt-12 animate-fade-in">
            <a
              href="/jobs"
              className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg hover:shadow-xl hover:shadow-orange-200 transform hover:scale-105"
            >
              View All Jobs
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsListAdvanced;
