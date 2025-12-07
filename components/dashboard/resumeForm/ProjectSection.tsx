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
    setProj({ title: "", link: "", description: "" });
  };

  return (
    <div className="space-y-4 bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-2">
        <Rocket className="w-5 h-5 text-orange-600" />
        <h2 className="font-semibold text-gray-800 text-lg">Projects</h2>
      </div>

      <input
        value={proj.title}
        onChange={(e) => setProj({ ...proj, title: e.target.value })}
        placeholder="Project Title *"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
      />
      <input
        value={proj.link}
        onChange={(e) => setProj({ ...proj, link: e.target.value })}
        placeholder="Project Link (optional)"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
      />
      <textarea
        value={proj.description}
        onChange={(e) => setProj({ ...proj, description: e.target.value })}
        placeholder="Description (optional)"
        rows={3}
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
      />
      <Button
        variant="secondary"
        className="mt-2 px-4 py-2"
        onClick={() => {
          onAdd(proj);
          setProj({ type: "project", title: "", link: "", description: "" });
        }}
      >
        Add Project

      <Button variant="secondary" className="flex justify-center items-center gap-2 w-full" onClick={handleAdd}>
        <Plus className="w-4 h-4" /> Add Project
      </Button>
    </div>
  );
}