"use client";

import { useEffect, useState, useRef } from "react";
import { ApplicationCard } from "@/components/ApplicationCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import { Job } from "@/types/job.types";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "@/components/ui/Button";
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
  job: Job & {
    company?: {
      companyName: string;
      location: string;
      logo?: string;
    };
  };
}

export default function ApplicationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [allApps, setAllApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    | "all"
    | "PENDING"
    | "REVIEWED"
    | "SHORTLISTED"
    | "INTERVIEWING"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showMore, setShowMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterLabels = {
    all: "All",
    PENDING: "Pending",
    REVIEWED: "In Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEWING: "Interviewing",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);

      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.email) {
        setAllApps([]);
        return;
      }

      try {
        const headers = createApiHeadersWithoutContentType(user);
        const res = await fetch("/api/job-applications", {
          headers,
        });
        const data = await res.json();
        setAllApps(Array.isArray(data) ? data : []);
      } catch {
        setAllApps([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const statusCounts = {
    all: allApps.length,
    PENDING: allApps.filter((a) => a.status === "PENDING").length,
    REVIEWED: allApps.filter((a) => a.status === "REVIEWED").length,
    SHORTLISTED: allApps.filter((a) => a.status === "SHORTLISTED").length,
    INTERVIEWING: allApps.filter((a) => a.status === "INTERVIEWING").length,
    ACCEPTED: allApps.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: allApps.filter((a) => a.status === "REJECTED").length,
    WITHDRAWN: allApps.filter((a) => a.status === "WITHDRAWN").length,
  };

  const filteredApps = allApps.filter(
    (app) => filter === "all" || app.status === filter
  );

  const totalFiltered = filteredApps.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  if (allApps.length === 0) {
    return (
      <ProtectedRoute>
        <div className="py-16 text-center dark:bg-gray-900 min-h-screen dark:text-white">
          {/* Dark mode icon color */}
          <FileText className="mx-auto mb-4 w-16 h-16 text-gray-400 dark:text-gray-500" />
          <h2 className="mb-2 font-bold text-2xl dark:text-white">
            No Applications Yet
          </h2>
          {/* Dark mode text color */}
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {`You haven't applied to any jobs yet.`}
          </p>
          <Link href="/jobs">
            {/* Dark mode button color */}
            <button className="bg-blue-600 disabled:opacity-50 px-4 py-2 rounded text-white dark:bg-primary dark:hover:bg-primary/90">
              Browse Jobs
            </button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const visibleFilters = [
    "all",
    "PENDING",
    "REVIEWED",
    "SHORTLISTED",
    "INTERVIEWING",
  ] as const;
  const hiddenFilters = ["ACCEPTED", "REJECTED", "WITHDRAWN"] as const;

  const isActiveHidden = (hiddenFilters as readonly string[]).includes(filter);

  return (
    <ProtectedRoute>
      <div className="mx-auto p-8 max-w-6xl dark:bg-gray-900 min-h-screen">
        {/* Dark mode header text color */}
        <h1 className="mb-8 font-bold text-3xl dark:text-white">
          My Job Applications
        </h1>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {visibleFilters.map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
                setShowMore(false);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? "bg-blue-600 text-white dark:bg-primary dark:hover:bg-primary/90" // Active dark mode
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" // Inactive dark mode
              }`}
            >
              {filterLabels[status]} ({statusCounts[status]})
            </button>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMore(!showMore);
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActiveHidden
                  ? "bg-blue-600 text-white dark:bg-primary dark:hover:bg-primary/90" // Active dark mode
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" // Inactive dark mode
              }`}
            >
              {isActiveHidden
                ? `${filterLabels[filter]} (${statusCounts[filter]})`
                : "More"}
              {showMore ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showMore && (
              <div
                // Dark mode dropdown menu container
                className="top-full right-0 z-10 absolute bg-white shadow-lg mt-1 border border-gray-200 rounded-lg w-48 dark:bg-gray-800 dark:border-gray-700 dark:shadow-xl"
              >
                {hiddenFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setCurrentPage(1);
                      setShowMore(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      filter === status
                        ? "bg-blue-100 text-blue-600 font-medium dark:bg-primary/20 dark:text-primary" // Active item dark mode
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700" // Inactive item dark mode
                    }`}
                  >
                    {filterLabels[status]} ({statusCounts[status]})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* ApplicationCard component assumes it has its own dark mode styles applied */}
          {paginatedApps.map((app) => (
            <ApplicationCard
              key={app.id}
              applicationId={app.id}
              title={app.job.title}
              company={app.job.company?.companyName || "Unknown Company"}
              location={app.job.location}
              status={app.status}
              appliedAt={app.createdAt}
              logo={app.job.company?.logo}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("prev")}
              // Dark mode pagination button styles
              className={`flex items-center gap-2 border-orange-500 text-orange-600 dark:border-primary dark:text-primary ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Dark mode pagination text */}
            <span className="font-medium text-gray-600 text-sm dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("next")}
              // Dark mode pagination button styles
              className={`flex items-center gap-2 border-orange-500 text-orange-600 dark:border-primary dark:text-primary ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
