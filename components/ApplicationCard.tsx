"use client";

import { MapPin, Calendar, Briefcase, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ApplicationCardProps {
  applicationId: string
  title: string;
  company?: string;
  location: string;
  status:
    | "PENDING"
    | "REVIEWED"
    | "SHORTLISTED"
    | "INTERVIEWING"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
  appliedAt: string;
  logo?: string;
}

export function ApplicationCard({
  applicationId,
  title,
  company = "Unknown",
  location,
  status,
  appliedAt,
  logo,
}: ApplicationCardProps) {
  const statusConfig = {
    PENDING: {
      color:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
      label: "Pending",
    },
    REVIEWED: {
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      label: "In Review",
    },
    SHORTLISTED: {
      color:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
      label: "Shortlisted",
    },
    INTERVIEWING: {
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
      label: "Interviewing",
    },
    ACCEPTED: {
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      label: "Accepted",
    },
    REJECTED: {
      color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      label: "Rejected",
    },
    WITHDRAWN: {
      color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
      label: "Withdrawn",
    },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/dashboard/user/applications/${applicationId}`}>
      <div className="bg-white dark:bg-gray-800 hover:shadow-md dark:hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-600 p-6 border border-gray-200 dark:border-gray-700 rounded-xl transition cursor-pointer group mt-5">
        <div className="flex gap-4">
          {logo ? (
            <Image
              src={logo}
              alt={company ?? "Company"}
              width={64}
              height={64}
              className="shadow-sm rounded-lg object-cover"
            />
          ) : (
            <div className="flex justify-center items-center bg-orange-50 dark:bg-orange-900/30 shadow-sm rounded-lg w-16 h-16">
              <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          )}

          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="mb-1 font-bold text-gray-900 dark:text-white text-xl group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                  {title}
                </h3>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  {company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}
                >
                  {config.label}
                </span>
                <div className="hidden group-hover:flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>
                  Applied{" "}
                  {new Date(appliedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
