"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";
import { MessageCircle } from "lucide-react";

interface JobApplication {
  id: string;
  userId: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    workType: string;
    salaryMin?: number;
    salaryMax?: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    jobSeeker?: {
      firstName: string;
      lastName: string;
      phone?: string;
      city?: string;
      skills: string[];
    };
  };
}

export default function AllApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [creatingConversation, setCreatingConversation] = useState<
    string | null
  >(null);

  const jobId = searchParams?.get("jobId");

  // Fetch all applications for the company
  const fetchApplications = async () => {
    if (!user || user.userType !== "COMPANY") {
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (filterStatus !== "ALL") {
        params.set("status", filterStatus);
      }

      if (searchTerm) {
        params.set("search", searchTerm);
      }

      if (jobId) {
        params.set("jobId", jobId);
      }

      const response = await fetch(`/api/applications?${params}`, {
        headers: createApiHeadersWithoutContentType(user),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        data = { applications: [], total: 0, totalPages: 1 };
      }

      console.log("Applications data:", data);

      if (response.ok && data) {
        setApplications(data.applications || []);
        setTotalPages(data.totalPages || 1);
        setTotalApplications(data.total || 0);
      } else {
        console.error("API Error:", data);
        setApplications((data && data.applications) || []);
        setTotalPages((data && data.totalPages) || 1);
        setTotalApplications((data && data.total) || 0);
        toast.error((data && data.error) || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: createApiHeadersWithoutContentType(user),
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Application status updated successfully!");
        fetchApplications();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application status");
    }
  };

  // Create conversation with applicant
  const createConversation = async (applicationId: string) => {
    setCreatingConversation(applicationId);

    try {
      const headers = {
        ...createApiHeadersWithoutContentType(user),
        "Content-Type": "application/json",
      };

      const response = await fetch("/api/applications/message", {
        method: "POST",
        headers,
        body: JSON.stringify({ applicationId }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        // Redirect to messages page
        router.push("/dashboard/company/messages");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create conversation");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Error creating conversation");
    } finally {
      setCreatingConversation(null);
    }
  };

  useEffect(() => {
    if (user?.userType === "COMPANY") {
      fetchApplications();
    }
  }, [currentPage, filterStatus, user]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchApplications();
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      REVIEWED: "bg-blue-100 text-blue-800",
      SHORTLISTED: "bg-green-100 text-green-800",
      INTERVIEWING: "bg-purple-100 text-purple-800",
      ACCEPTED: "bg-emerald-100 text-emerald-800",
      REJECTED: "bg-red-100 text-red-800",
      WITHDRAWN: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status as keyof typeof statusStyles] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  if (loading && !applications.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                All Applications
              </h1>
              <p className="text-gray-600">
                Manage all job applications across your company
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-sm text-gray-600">
                {totalApplications} total applications
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search by applicant name, email, or job title..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Search
            </button>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600 mb-4">
                {filterStatus !== "ALL" || searchTerm
                  ? "Try adjusting your filters or search terms."
                  : "No one has applied to your jobs yet."}
              </p>
              {filterStatus !== "ALL" || searchTerm ? (
                <button
                  onClick={() => {
                    setFilterStatus("ALL");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="text-primary hover:text-primary/80"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              {/* Applications */}
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/company/applications/${application.id}`
                          )
                        }
                        className="font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        {application.user.name}
                      </button>
                      <p className="text-sm text-gray-600 mb-1">
                        {application.user.email}
                      </p>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/company/jobs/${application.job.id}/applications`
                          )
                        }
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {application.job.title}
                      </button>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-1 text-gray-900">
                        {application.user.jobSeeker?.phone || "Not provided"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Applied:</span>
                      <span className="ml-1 text-gray-900">
                        {formatDate(application.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {application.user.jobSeeker?.skills &&
                    application.user.jobSeeker.skills.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600 mb-2 block">
                          Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {application.user.jobSeeker.skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/company/applications/${application.id}`
                        )
                      }
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => createConversation(application.id)}
                      disabled={creatingConversation === application.id}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:bg-gray-400 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {creatingConversation === application.id
                        ? "..."
                        : "Message"}
                    </button>
                    {(application.status === "SHORTLISTED" ||
                      application.status === "REVIEWED") && (
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/company/interviews/schedule/${application.id}`
                          )
                        }
                        className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-md text-sm font-medium hover:shadow-lg transition-shadow"
                      >
                        Schedule Interview
                      </button>
                    )}
                    {application.status === "PENDING" && (
                      <button
                        onClick={() =>
                          updateApplicationStatus(application.id, "REVIEWED")
                        }
                        className="px-3 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                Page {currentPage} of {totalPages} ({totalApplications} total
                applications)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`px-3 py-2 border rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
