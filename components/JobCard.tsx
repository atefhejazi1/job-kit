"use client";

import { Job } from "@/types/job.types";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MapPin, Briefcase, DollarSign, Calendar, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

interface JobCardProps {
  job: Job & {
    company?: {
      companyName: string;
      location?: string;
      logo?: string;
    };
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From ${min.toLocaleString()}`;
    if (max) return `Up to ${max.toLocaleString()}`;
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-300 overflow-hidden transform hover:scale-[1.02]">
      {/* Card Border Animation */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-50 via-orange-100 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full -mr-12 -mt-12"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium text-sm">
              {job.company?.companyName || "Company not specified"}
            </p>
          </div>
          {job.company?.logo && (
            <div className="ml-4 flex-shrink-0">
              <Image
                src={job.company.logo}
                alt={job.company.companyName}
                width={64}
                height={64}
                className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:rotate-3 group-hover:scale-110"
              />
            </div>
          )}
        </div>

        {/* Quick Info Tags */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-full border border-orange-200/50 group-hover:border-orange-300 transition-all">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-700">
              {job.location}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200/50 group-hover:border-purple-300 transition-all">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-700">
              {job.workType}
            </span>
          </div>

          {job.salaryMin || job.salaryMax ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50 group-hover:border-green-300 transition-all">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-700">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            </div>
          ) : null}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs font-semibold rounded-full hover:from-orange-200 hover:to-red-200 transition-all cursor-pointer transform hover:scale-105"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:from-gray-200 hover:to-gray-300 transition-all">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveJob}
              disabled={isLoading || !user?.id}
              className={`px-3 py-2 rounded-lg transition-all transform hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-2 ${
                isSaved
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <Link
              href={`/jobs/${job.id}`}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-orange-200"
            >
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
