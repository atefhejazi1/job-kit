"use client";

import { useState } from "react";
import { ProjectItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Projects</h2>
      <input
        className="block w-full border p-2 rounded mb-2"
        placeholder="Title"
        onChange={(e) => setProj({ ...proj, title: e.target.value })}
      />
      <input
        className="block w-full border p-2 rounded mb-2"
        placeholder="Link"
        onChange={(e) => setProj({ ...proj, link: e.target.value })}
      />
      <textarea
        className="block w-full border p-2 rounded h-20"
        placeholder="Description"
        onChange={(e) => setProj({ ...proj, description: e.target.value })}
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
      </Button>
    </div>
  );
}
