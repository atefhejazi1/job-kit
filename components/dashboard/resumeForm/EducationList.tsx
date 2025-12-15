"use client";

import { EducationItem } from "@/types/resume.data.types";
import { toast } from "react-hot-toast";
import { Calendar, GraduationCap, Trash2 } from "lucide-react";

interface Props {
  education: EducationItem[];
  onDelete: (index: number) => void;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + "-01");
  const endDate = new Date(end + "-01");
  return `${startDate.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  })} – ${endDate.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  })}`;
}

export default function EducationList({ education, onDelete }: Props) {
  if (education.length === 0) return null;

  const handleDelete = (i: number) => {
    if (!confirm("Delete this education entry?")) return;
    onDelete(i);
    toast.success("Education deleted successfully");
  };

  return (
    <div className="space-y-3 mt-4">
      {education.map((edu, i) => (
        <div
          key={i}
          // Dark mode styles for education item container
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow
          dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              {/* Dark mode for GraduationCap icon color */}
              <GraduationCap className="mt-1 w-5 h-5 text-orange-600 dark:text-primary" />
              <div>
                {/* Dark mode for title text color */}
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {edu.school} — {edu.degree}
                </h3>
                {/* Dark mode for date and calendar icon color */}
                <p className="flex items-center gap-1 mt-1 text-gray-500 text-sm dark:text-gray-400">
                  <Calendar className="w-3 h-3 text-orange-500 dark:text-primary" />
                  {formatDateRange(edu.startDate, edu.endDate)}
                </p>
                {edu.description && (
                  // Dark mode for description text color
                  <p className="mt-2 text-gray-600 text-sm dark:text-gray-300">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(i)}
              // Dark mode for Trash icon color and hover state
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity cursor-pointer
              dark:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}