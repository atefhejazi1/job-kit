"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import JobListView from "@/components/JobListView";
import {
  MapPin,
  Search,
  Filter,
  Building,
  Clock,
  DollarSign,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  workType: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  skills: string[];
  deadline?: string;
  requirements: string[];
  benefits: string[];
  createdAt: string;
  company: {
    id: string;
    companyName: string;
    logo?: string;
    location?: string;
    industry?: string;
    description?: string;
  };
}

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter, workTypeFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const headers = user ? createApiHeadersWithoutContentType(user) : {};
      const response = await fetch("/api/jobs", { headers });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        console.error("Failed to fetch jobs:", response.status);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (workTypeFilter) {
      filtered = filtered.filter(
        (job) => job.workType.toLowerCase() === workTypeFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  const uniqueLocations = Array.from(
    new Set((jobs || []).map((job) => job.location))
  ).filter(Boolean);
  const workTypes = Array.from(
    new Set((jobs || []).map((job) => job.workType))
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto"></div>
                <Briefcase className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Loading Amazing Jobs...
              </h3>
              <p className="text-gray-600">
                Finding the best opportunities for you
              </p>
            </div>
          </div>

          {/* Loading Skeleton */}
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Briefcase className="w-10 h-10 text-orange-600" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-orange-600 bg-clip-text text-transparent">
                Find Your Dream Job
              </h1>
              <TrendingUp className="w-10 h-10 text-orange-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover thousands of exciting job opportunities from top
              companies. Start your career journey today!
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Job title, company, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Work Type Filter */}
              <div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={workTypeFilter}
                    onChange={(e) => setWorkTypeFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none transition-all"
                  >
                    <option value="">All Types</option>
                    {workTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Showing{" "}
                <span className="text-orange-600 font-semibold">
                  {filteredJobs.length}
                </span>{" "}
                of <span className="font-semibold">{jobs.length}</span> jobs
              </div>
              {(searchTerm || locationFilter || workTypeFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setWorkTypeFilter("");
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-orange-200 mb-6">
              <Search className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No jobs found
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchTerm || locationFilter || workTypeFilter
                ? "Try adjusting your search filters to find more opportunities"
                : "No jobs are currently available. Check back soon!"}
            </p>
            {(searchTerm || locationFilter || workTypeFilter) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setWorkTypeFilter("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobListView job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
