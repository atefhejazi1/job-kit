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
          // Dark mode styles for project item container
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow
          dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              {/* Dark mode for Rocket icon color */}
              <Rocket className="mt-1 w-5 h-5 text-orange-600 dark:text-primary" />
              <div>
                {/* Dark mode for title text color */}
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {proj.title}
                </h3>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Dark mode for link text color
                    className="flex items-center gap-1 mt-1 text-blue-600 text-sm hover:underline dark:text-blue-400"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Project
                  </a>
                )}
                {proj.description && (
                  // Dark mode for description text color
                  <p className="mt-2 text-gray-600 text-sm dark:text-gray-300">
                    {proj.description}
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