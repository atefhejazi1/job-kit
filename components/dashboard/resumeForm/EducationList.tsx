"use client";

import { EducationItem } from "@/types/resume.data.types";

interface Props {
  education: EducationItem[];
  onDelete: (index: number) => void;
}

export default function EducationList({ education, onDelete }: Props) {
  if (education.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {education.map((edu, i) => (
        <div key={i} className="flex justify-between items-start bg-gray-50 p-3 border rounded">
          <div>
            <p className="font-semibold">{edu.school} — {edu.degree}</p>
            <p className="text-gray-600 text-sm">{edu.startDate} - {edu.endDate}</p>
            <p className="mt-1 text-sm">{edu.description}</p>
          </div>
          <button onClick={() => onDelete(i)} className="font-medium text-red-600 hover:text-red-800 text-sm">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}