"use client";

import { useState } from "react";
import { ProjectItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { Rocket, ExternalLink, Plus } from "lucide-react";

interface Props {
  onAdd: (proj: ProjectItem) => void;
}

export default function ProjectSection({ onAdd }: Props) {
  const [proj, setProj] = useState<ProjectItem>({
    type: "project",
    title: "",
    link: "",
    description: "",
  });

  const handleAdd = () => {
    if (!proj.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    onAdd(proj);
    toast.success("Project added successfully");
    setProj({ type: "project", title: "", link: "", description: "" });
  };

  return (
    <div
      // Dark mode styles for container
      className="space-y-4 bg-white shadow-sm p-5 border border-gray-200 rounded-xl
      dark:bg-gray-800 dark:shadow-md dark:border-gray-700"
    >
      <div className="flex items-center gap-2">
        {/* Icon color for dark mode */}
        <Rocket className="w-5 h-5 text-orange-600 dark:text-primary" />
        {/* Header text color for dark mode */}
        <h2 className="font-semibold text-gray-800 text-lg dark:text-white">
          Projects
        </h2>
      </div>

      {/* Input fields for dark mode */}
      <input
        value={proj.title}
        onChange={(e) =>
          setProj({ ...proj, title: e.target.value, type: "project" })
        }
        placeholder="Project Title *"
        className="px-3 py-2 border border-gray-300 rounded-lg w-full
          focus:border-transparent focus:ring-2 focus:ring-orange-500/50 
          dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary/50"
      />
      <input
        value={proj.link}
        onChange={(e) =>
          setProj({ ...proj, link: e.target.value, type: "project" })
        }
        placeholder="Project Link (optional)"
        className="px-3 py-2 border border-gray-300 rounded-lg w-full
          focus:border-transparent focus:ring-2 focus:ring-orange-500/50
          dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary/50"
      />
      <textarea
        value={proj.description}
        onChange={(e) =>
          setProj({ ...proj, description: e.target.value, type: "project" })
        }
        placeholder="Description (optional)"
        rows={3}
        className="px-3 py-2 border border-gray-300 rounded-lg w-full
          focus:border-transparent focus:ring-2 focus:ring-orange-500/50
          dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary/50"
      />
      <Button
        variant="secondary"
        className="flex justify-center items-center gap-2 w-full"
        onClick={handleAdd}
      >
        <Plus className="w-4 h-4" /> Add Project
      </Button>
    </div>
  );
}