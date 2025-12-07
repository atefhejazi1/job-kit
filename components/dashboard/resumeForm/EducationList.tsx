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
  return `${startDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${endDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
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
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-1 w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {edu.school} — {edu.degree}
                </h3>
                <p className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 text-orange-500" />
                  {formatDateRange(edu.startDate, edu.endDate)}
                </p>
                {edu.description && (
                  <p className="mt-2 text-gray-600 text-sm">{edu.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}