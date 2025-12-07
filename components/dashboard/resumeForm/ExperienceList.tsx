"use client";

import { ExperienceItem } from "@/types/resume.data.types";
import { toast } from "react-hot-toast";
import { Calendar, Briefcase, Trash2 } from "lucide-react";

interface Props {
  experience: ExperienceItem[];
  onDelete: (index: number) => void;
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start + "-01");
  const endDate = new Date(end + "-01");
  return `${startDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${endDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;
}

export default function ExperienceList({ experience, onDelete }: Props) {
  if (experience.length === 0) return null;

  const handleDelete = (i: number) => {
    if (!confirm("Delete this experience entry?")) return;
    onDelete(i);
    toast.success("Experience deleted successfully");
  };

  return (
    <div className="space-y-3 mt-4">
      {experience.map((exp, i) => (
        <div
          key={i}
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Briefcase className="mt-1 w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {exp.company} — {exp.role}
                </h3>
                <p className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 text-orange-500" />
                  {formatDateRange(exp.startDate, exp.endDate)}
                </p>
                {exp.description && (
                  <p className="mt-2 text-gray-600 text-sm">{exp.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(i)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacitycursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}