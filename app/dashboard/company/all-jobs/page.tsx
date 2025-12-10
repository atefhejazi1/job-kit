"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Job, WorkType } from "@/types/job.types";
import { useAuth } from "@/contexts/AuthContext";
import {
  createApiHeaders,
  createApiHeadersWithoutContentType,
} from "@/lib/api-utils";
import toast from "react-hot-toast";

interface JobWithCompany extends Job {
  company: {
    companyName: string;
    location: string;
    logo?: string;
  };
}

const AllJobsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWorkType, setFilterWorkType] = useState<WorkType | "">("");
  const [filterExperience, setFilterExperience] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    jobId: string;
    jobTitle: string;
  }>({
    show: false,
    jobId: "",
    jobTitle: "",
  });

  const jobsPerPage = 10;

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: jobsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterWorkType && { workType: filterWorkType }),
        ...(filterExperience && { experienceLevel: filterExperience }),
      });

      const response = await fetch(`/api/dashboard/jobs?${params}`, {
        headers: createApiHeadersWithoutContentType(user),
      });
      const data = await response.json();

      if (response.ok) {
        setJobs(data.jobs);
        setTotalJobs(data.total);
      } else {
        console.error("Failed to fetch jobs:", data.error);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const deleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/dashboard/jobs/${jobId}`, {
        method: "DELETE",
        headers: createApiHeadersWithoutContentType(user),
      });

      if (response.ok) {
        toast.success("Job deleted successfully!");
        fetchJobs(); // Refresh the list
        setDeleteModal({ show: false, jobId: "", jobTitle: "" });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  // Toggle job status (active/inactive)
  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/dashboard/jobs/${jobId}`, {
        method: "PATCH",
        headers: createApiHeaders(user),
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        // Update the job status locally without refetching
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, isActive: !currentStatus } : job
          )
        );

        toast.success(
          `Job ${!currentStatus ? "activated" : "deactivated"} successfully!`
        );
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, filterWorkType, filterExperience]);

  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  const formatSalary = (min?: number, max?: number, currency = "USD") => {
    if (!min && !max) return "Salary not specified";
    if (min && max)
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    return `Up to ${currency} ${max?.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getWorkTypeLabel = (workType: WorkType) => {
    const labels: Record<WorkType, string> = {
      FULL_TIME: "Full Time",
      PART_TIME: "Part Time",
      CONTRACT: "Contract",
      FREELANCE: "Freelance",
      INTERNSHIP: "Internship",
      REMOTE: "Remote",
    };
    return labels[workType] || workType;
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    // Added dark:bg-gray-900 to the main container
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        {/* Added dark:bg-gray-800 and dark:shadow-lg */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              {/* Added dark:text-primary */}
              <h1 className="text-3xl font-bold text-secondary dark:text-primary mb-2">
                All Jobs
              </h1>
              {/* Added dark:text-gray-400 */}
              <p className="text-gray-600 dark:text-gray-400">
                Manage your job postings
              </p>
            </div>
            <Link href="/dashboard/company/add-job">
              <Button variant="primary" className="mt-4 md:mt-0">
                + Post New Job
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                // Added dark classes for input field
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <select
                value={filterWorkType}
                onChange={(e) =>
                  setFilterWorkType(e.target.value as WorkType | "")
                }
                // Added dark classes for select field
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">All Work Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div>
              <select
                value={filterExperience}
                onChange={(e) => setFilterExperience(e.target.value)}
                // Added dark classes for select field
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">All Experience Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            {/* Added dark:text-gray-400 */}
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              Total: {totalJobs} jobs
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {/* Added dark:bg-gray-800 and dark:shadow-lg */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg">
          {loading ? (
            // Added dark:text-gray-400
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading jobs...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            // Added dark:text-gray-300 and dark:text-gray-400
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterWorkType || filterExperience
                  ? "Try adjusting your filters or search terms."
                  : "Start by posting your first job."}
              </p>
              <Link href="/dashboard/company/add-job">
                <Button variant="primary">Post Your First Job</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Table Header - Desktop */}
              <div className="hidden md:block">
                {/* Added dark:border-gray-700, dark:text-gray-300, and dark:bg-gray-700 */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                  <div className="col-span-3">Job Title</div>
                  <div className="col-span-2">Work Type</div>
                  <div className="col-span-1">Experience</div>
                  <div className="col-span-2">Salary</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Posted</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>

              {/* Jobs */}
              {jobs.map((job) => (
                <div
                  key={job.id}
                  // Added dark:border-gray-700
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  {/* Desktop View */}
                  {/* Added dark:hover:bg-gray-700/50 */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="col-span-3">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/company/applications?jobId=${job.id}`
                          )
                        }
                        className="text-left hover:text-primary transition-colors"
                      >
                        {/* Added dark:text-gray-100 */}
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 hover:text-primary">
                          {job.title}
                        </h3>
                      </button>
                      {/* Added dark:text-gray-400 */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.location}
                      </p>
                      {job.deadline && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Deadline: {formatDate(job.deadline.toString())}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      {/* Added dark classes for work type badge */}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-800 dark:text-blue-100">
                        {getWorkTypeLabel(job.workType)}
                      </span>
                    </div>

                    <div className="col-span-1">
                      {/* Added dark:text-gray-400 */}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {job.experienceLevel}
                      </span>
                    </div>

                    <div className="col-span-2">
                      {/* Added dark:text-gray-300 */}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {formatSalary(
                          job.salaryMin || undefined,
                          job.salaryMax || undefined,
                          job.currency
                        )}
                      </span>
                    </div>

                    <div className="col-span-1">
                      {getStatusBadge(job.isActive)}
                    </div>

                    <div className="col-span-1">
                      {/* Added dark:text-gray-500 */}
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(job.createdAt.toString())}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <div className="flex space-x-1">
                        {/* No dark classes needed for action buttons as they are colored */}
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/company/applications?jobId=${job.id}`
                            )
                          }
                          className="px-2 py-1 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600 hover:scale-105 transition-all duration-200 flex items-center space-x-1 cursor-pointer"
                          title="View Applications"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/dashboard/company/edit-job/${job.id}`)
                          }
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex items-center space-x-1 cursor-pointer"
                          title="Edit Job"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleJobStatus(job.id, job.isActive)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 flex items-center space-x-1 cursor-pointer hover:scale-105 ${
                            job.isActive
                              ? "bg-orange-500 text-white hover:bg-orange-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                          title={
                            job.isActive ? "Deactivate Job" : "Activate Job"
                          }
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {job.isActive ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-5a9 9 0 019-9V3m0 2a9 9 0 019 9h-2m-2 0a9 9 0 01-9 9v-2m-2 0a9 9 0 009-9H9m5 0V9"
                              />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              show: true,
                              jobId: job.id,
                              jobTitle: job.title,
                            })
                          }
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 hover:scale-105 transition-all duration-200 flex items-center space-x-1 cursor-pointer"
                          title="Delete Job"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/company/applications?jobId=${job.id}`
                            )
                          }
                          className="text-left hover:text-primary transition-colors mb-1"
                        >
                          {/* Added dark:text-gray-100 */}
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary">
                            {job.title}
                          </h3>
                        </button>
                        {/* Added dark:text-gray-400 */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {job.location}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {/* Added dark classes for work type badge */}
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium dark:bg-blue-800 dark:text-blue-100">
                            {getWorkTypeLabel(job.workType)}
                          </span>
                          {getStatusBadge(job.isActive)}
                        </div>
                      </div>
                    </div>

                    {/* Added dark:text-gray-400 and dark:text-gray-300 */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Experience:
                        </span>
                        <span className="ml-1 text-gray-900 dark:text-gray-300">
                          {job.experienceLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Posted:
                        </span>
                        <span className="ml-1 text-gray-900 dark:text-gray-300">
                          {formatDate(job.createdAt.toString())}
                        </span>
                      </div>
                    </div>

                    {/* Added dark:text-gray-400 and dark:text-gray-300 */}
                    <div className="text-sm mb-3">
                      <span className="text-gray-600 dark:text-gray-400">
                        Salary:
                      </span>
                      <span className="ml-1 text-gray-900 dark:text-gray-300">
                        {formatSalary(
                          job.salaryMin || undefined,
                          job.salaryMax || undefined,
                          job.currency
                        )}
                      </span>
                    </div>

                    {job.deadline && (
                      <div className="text-xs text-red-600 dark:text-red-400 mb-3">
                        Deadline: {formatDate(job.deadline.toString())}
                      </div>
                    )}

                    {/* Action buttons - no dark classes needed as they are colored */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/company/applications?jobId=${job.id}`
                          )
                        }
                        className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-md text-sm font-medium hover:bg-purple-600 hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>Applications</span>
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/company/edit-job/${job.id}`)
                        }
                        className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => toggleJobStatus(job.id, job.isActive)}
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer hover:scale-105 ${
                          job.isActive
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {job.isActive ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-5a9 9 0 019-9V3m0 2a9 9 0 019 9h-2m-2 0a9 9 0 01-9 9v-2m-2 0a9 9 0 009-9H9m5 0V9"
                            />
                          )}
                        </svg>
                        <span>{job.isActive ? "Deactivate" : "Activate"}</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            show: true,
                            jobId: job.id,
                            jobTitle: job.title,
                          })
                        }
                        className="px-3 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          // Added dark:bg-gray-800 and dark:shadow-lg
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-lg p-4 mt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Added dark:text-gray-400 */}
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                Showing {(currentPage - 1) * jobsPerPage + 1} to{" "}
                {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs}{" "}
                jobs
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  // Added dark classes for pagination button
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:text-gray-500"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      // Added dark classes for active/inactive page buttons
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? "border-primary bg-primary text-white dark:border-primary dark:bg-primary"
                          : "border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  // Added dark classes for pagination button
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:text-gray-500"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Added dark:bg-gray-800 and dark:shadow-lg */}
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 dark:shadow-lg">
              {/* Added dark:text-gray-100 */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Delete Job Posting
              </h3>
              {/* Added dark:text-gray-400 */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{deleteModal.jobTitle}"? This
                action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    setDeleteModal({ show: false, jobId: "", jobTitle: "" })
                  }
                  // Added dark classes for Cancel button
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                {/* Delete button doesn't need dark classes (red color) */}
                <button
                  onClick={() => deleteJob(deleteModal.jobId)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllJobsPage;