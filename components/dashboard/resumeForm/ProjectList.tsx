"use client";

import { ProjectItem } from "@/types/resume.data.types";
import { toast } from "react-hot-toast";
import { ExternalLink, Trash2, Rocket } from "lucide-react";

interface Props {
  projects: ProjectItem[];
  onDelete: (index: number) => void;
}

export default function ProjectList({ projects, onDelete }: Props) {
  if (projects.length === 0) return null;

  const handleDelete = (i: number) => {
    if (!confirm("Delete this project?")) return;
    onDelete(i);
    toast.success("Project deleted successfully");
  };

  return (
    <div className="space-y-3 mt-4">
      {projects.map((proj, i) => (
        <div
          key={i}
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Rocket className="mt-1 w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 mt-1 text-blue-600 text-sm hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Project
                  </a>
                )}
                {proj.description && (
                  <p className="mt-2 text-gray-600 text-sm">{proj.description}</p>
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