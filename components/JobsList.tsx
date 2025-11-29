"use client";

import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
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
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>
          )}

          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading jobs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>
          )}

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-800 font-semibold text-lg">❌ {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {(title || description) && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{title}</h2>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>
          )}

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
            <p className="text-yellow-800 font-semibold text-lg">📭 No jobs available at the moment</p>
            <p className="text-yellow-700 mt-2">Check back soon for new opportunities!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {(title || description) && (
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">{title}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>

        {showMore && hasMore && (
          <div className="text-center mt-12 animate-fade-in">
            <a
              href="/jobs"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
