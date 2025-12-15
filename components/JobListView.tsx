"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface JobListViewProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    workType: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    currency?: string;
    skills?: string[];
    deadline?: string | Date | null;
    requirements?: string[];
    benefits?: string[];
    createdAt?: string | Date;
    company?: {
      id?: string;
      companyName: string;
      location?: string;
      logo?: string;
    };
  };
}

const JobListView: React.FC<JobListViewProps> = ({ job }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      checkIfSaved();
    }
  }, [job.id, user?.id]);

  const checkIfSaved = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/saved-jobs?jobId=${job.id}`, {
        headers: {
          "x-user-id": user.id,
        },
      });
      const data = await res.json();
      setIsSaved(data.jobs.some((savedJob: any) => savedJob.jobId === job.id));
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleSaveJob = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setIsLoading(true);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved-jobs?jobId=${job.id}`, {
          method: "DELETE",
          headers: {
            "x-user-id": user.id,
          },
        });

        if (res.ok) {
          setIsSaved(false);
          toast.success("Job removed from saved list");
        }
      } else {
        const res = await fetch("/api/saved-jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({ jobId: job.id }),
        });

        if (res.ok) {
          const data = await res.json();
          setIsSaved(true);
          toast.success(`"${job.title}" saved successfully!`);
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to save job");
        }
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return null;
    if (min && max)
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 p-6 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-red-50/30 dark:hover:from-orange-900/20 dark:hover:to-red-900/20">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.company?.logo ? (
            <Image
              src={job.company.logo}
              alt={job.company.companyName}
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-700 group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          )}
        </div>

        {/* Job Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">
                {job.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {job.company?.companyName || "Company not specified"}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {job.createdAt ? formatDate(job.createdAt) : "Recently"}
              </p>
            </div>
          </div>

          {/* Job Details Row */}
          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span>{job.workType}</span>
            </div>
            {formatSalary(job.salaryMin, job.salaryMax) && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="font-medium">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          {/* Skills & Action Row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {job.skills?.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {job.skills && job.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-md">
                  +{job.skills.length - 4}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveJob}
                disabled={isLoading || !user?.id}
                className={`px-3 py-2 rounded-lg transition-all font-medium text-sm shadow-sm hover:shadow-md flex items-center gap-1 ${
                  isSaved
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <Link
                href={`/jobs/${job.id}`}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListView;
