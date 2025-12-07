"use client";

import { ProjectItem } from "@/types/resume.data.types";

interface Props {
  projects: ProjectItem[];
  onDelete: (index: number) => void;
}

export default function ProjectList({ projects, onDelete }: Props) {
  if (projects.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {projects.map((proj, i) => (
        <div key={i} className="flex justify-between items-start bg-purple-50 p-3 border rounded">
          <div>
            <p className="font-semibold">{proj.title}</p>
            {proj.link && (
              <a href={proj.link} target="_blank" className="text-gray-600 text-sm underline">
                {proj.link}
              </a>
            )}
            <p className="mt-1 text-sm">{proj.description}</p>
          </div>
          <button onClick={() => onDelete(i)} className="font-medium text-red-600 hover:text-red-800 text-sm">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}