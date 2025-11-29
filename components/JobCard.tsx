"use client";

import { Job } from "@/types/job.types";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";

interface JobCardProps {
  job: Job & {
    company?: {
      companyName: string;
      location: string;
      logo?: string;
    };
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 overflow-hidden">
      {/* Card Border Animation */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full -mr-10 -mt-10"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
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
                className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
              />
            </div>
          )}
        </div>

        {/* Quick Info Tags */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">{job.location}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-gray-700">{job.workType}</span>
          </div>

          {job.salaryMin || job.salaryMax ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
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
              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full hover:from-blue-200 hover:to-indigo-200 transition-all"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
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
          <Link
            href={`/jobs/${job.id}`}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform group-hover:scale-105 font-semibold text-sm shadow-md hover:shadow-lg"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
