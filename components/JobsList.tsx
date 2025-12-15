"use client";

import React, { useEffect, useState } from "react";
import JobListView from "./JobListView";
import { Job } from "@/types/job.types";

interface JobsListProps {
  limit?: number;
  showMore?: boolean;
  title?: string;
  description?: string;
}

const JobsList: React.FC<JobsListProps> = ({
  limit = 6,
  showMore = true,
  title = "Latest Job Openings",
  description = "Explore the best job opportunities available",
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/jobs?page=1&limit=${limit}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        setJobs(data.jobs || []);
        setHasMore((data.total || 0) > limit);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  /* -------------------- Loading -------------------- */
  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            {description}
          </p>

          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading jobs...
          </p>
        </div>
      </section>
    );
  }

  /* -------------------- Error -------------------- */
  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl p-8">
            <p className="text-red-700 dark:text-red-400 font-semibold text-lg">
              ❌ {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* -------------------- Empty -------------------- */
  if (jobs.length === 0) {
    return (
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-orange-50 dark:bg-gray-900 border border-orange-200 dark:border-gray-800 rounded-xl p-10">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-orange-800 dark:text-orange-400 font-semibold text-lg">
              No jobs available at the moment
            </p>
            <p className="text-orange-700 dark:text-gray-400 mt-2">
              Check back soon for new opportunities!
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* -------------------- Main -------------------- */
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-orange-50/40 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

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

        {showMore && hasMore && (
          <div className="text-center mt-12">
            <a
              href="/jobs"
              className="
                inline-block px-8 py-3 rounded-lg font-semibold text-white
                bg-gradient-to-r from-orange-500 to-red-500
                hover:from-orange-600 hover:to-red-600
                shadow-lg hover:shadow-xl transition-all
                dark:shadow-orange-900/30
              "
            >
              View All Jobs
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsList;
