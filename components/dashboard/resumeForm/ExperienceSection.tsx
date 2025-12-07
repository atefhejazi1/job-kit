"use client";

import { useState } from "react";
import { ExperienceItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";

interface Props {
  onAdd: (exp: ExperienceItem) => void;
}

export default function ExperienceSection({ onAdd }: Props) {
  const [exp, setExp] = useState<ExperienceItem>({
    type: "experience",
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Experience</h2>
      <input
        className="block w-full border p-2 rounded mb-2"
        placeholder="Company"
        onChange={(e) => setExp({ ...exp, company: e.target.value })}
      />
      <input
        className="block w-full border p-2 rounded mb-2"
        placeholder="Role"
        onChange={(e) => setExp({ ...exp, role: e.target.value })}
      />
      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Start"
          onChange={(e) => setExp({ ...exp, startDate: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="End"
          onChange={(e) => setExp({ ...exp, endDate: e.target.value })}
        />
      </div>
      <textarea
        className="block w-full border p-2 rounded h-20 mt-2"
        placeholder="Description"
        onChange={(e) => setExp({ ...exp, description: e.target.value })}
      />
      <Button
        variant="secondary"
        className="mt-2 px-4 py-2"
        onClick={() => onAdd(exp)}
      >
        Add Experience
      </Button>
    </div>
  );
}
