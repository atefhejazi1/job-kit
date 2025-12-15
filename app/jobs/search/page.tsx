"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import JobCard from "@/components/JobCard";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Job, WorkType } from "@/types/job.types";

interface SearchFilters {
  location: string;
  workType: string;
  salaryMin: string;
  salaryMax: string;
  experienceLevel: string;
  skills: string;
}

interface JobCompany {
  id?: string;
  companyName: string;
  location?: string;
  logo?: string;
}

interface SearchJob extends Job {
  company?: JobCompany;
}

interface SearchResponse {
  jobs: SearchJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: SearchFilters;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-950 dark:to-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-8"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-slate-800 rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<SearchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams?.get("location") || "",
    workType: searchParams?.get("workType") || "",
    salaryMin: searchParams?.get("salaryMin") || "",
    salaryMax: searchParams?.get("salaryMax") || "",
    experienceLevel: searchParams?.get("experienceLevel") || "",
    skills: searchParams?.get("skills") || "",
  });

  // Fetch search results
  const fetchResults = useCallback(
    async (page: number = 1) => {
      if (!query && !Object.values(filters).some((v) => v)) {
        setJobs([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: "10",
          ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
        });

        const res = await fetch(`/api/jobs/search?${params}`);
        const data: SearchResponse = await res.json();

        setJobs(data.jobs);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotal(data.total);

        // Save search to history
        await fetch("/api/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, filters }),
        });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, filters]
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchResults(1);
  };

  const clearFilters = () => {
    setQuery("");
    setFilters({
      location: "",
      workType: "",
      salaryMin: "",
      salaryMax: "",
      experienceLevel: "",
      skills: "",
    });
    setJobs([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (query || Object.values(filters).some((v) => v)) {
      fetchResults(currentPage);
    }
  }, [currentPage]);

  const workTypeOptions = ["Full-Time", "Part-Time", "Contract", "Remote"];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Search Jobs
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Find your perfect job opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-6 sticky top-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Filters
              </h2>

              {/* Search Query */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title or keyword"
                  // input field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  placeholder="City or country"
                  // input field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Work Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Work Type
                </label>
                <select
                  value={filters.workType}
                  onChange={(e) =>
                    handleFilterChange("workType", e.target.value)
                  }
                  // select field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">All Types</option>
                  {workTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) =>
                    handleFilterChange("experienceLevel", e.target.value)
                  }
                  // select field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Min */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) =>
                    handleFilterChange("salaryMin", e.target.value)
                  }
                  placeholder="Min"
                  // input field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Salary Max */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Max Salary ($)
                </label>
                <input
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) =>
                    handleFilterChange("salaryMax", e.target.value)
                  }
                  placeholder="Max"
                  // input field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Skills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={filters.skills}
                  onChange={(e) => handleFilterChange("skills", e.target.value)}
                  placeholder="React, Node.js"
                  // input field style
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Action Buttons  */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            {jobs && jobs.length > 0 && (
              <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Found <span className="font-bold">{total}</span> job
                {total !== 1 ? "s" : ""}
              </div>
            )}

            {/* Job Cards */}
            <div className="space-y-4">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              ) : query || Object.values(filters).some((v) => v) ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No jobs found matching your search.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-xl p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    Enter search terms or select filters to find jobs.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {jobs && jobs.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {/* Previous Button  */}
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                     
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <Button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
