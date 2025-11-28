"use client";

import { ExperienceItem } from "@/types/resume.data.types";

interface Props {
  experience: ExperienceItem[];
  onDelete: (index: number) => void;
}

export default function ExperienceList({ experience, onDelete }: Props) {
  if (experience.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {experience.map((exp, i) => (
        <div key={i} className="flex justify-between items-start bg-gray-50 p-3 border rounded">
          <div>
            <p className="font-semibold">{exp.company} — {exp.role}</p>
            <p className="text-gray-600 text-sm">{exp.startDate} - {exp.endDate}</p>
            <p className="mt-1 text-sm">{exp.description}</p>
          </div>
          <button onClick={() => onDelete(i)} className="font-medium text-red-600 hover:text-red-800 text-sm">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}