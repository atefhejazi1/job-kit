"use client";

import { useState } from "react";
import { EducationItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";

interface Props {
  onAdd: (edu: EducationItem) => void;
}

export default function EducationSection({ onAdd }: Props) {
  const [edu, setEdu] = useState<EducationItem>({
    type: "education",
    school: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Education</h2>
      <input
        className="block w-full border p-2 rounded mb-2"
        placeholder="School"
        onChange={(e) => setEdu({ ...edu, school: e.target.value })}
      />
      <input
        className="block w-full border p-2 rounded mb-2"
        placeholder="Degree"
        onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
      />
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Start"
          className="border p-2 rounded w-full"
          onChange={(e) => setEdu({ ...edu, startDate: e.target.value })}
        />
        <input
          type="text"
          placeholder="End"
          className="border p-2 rounded w-full"
          onChange={(e) => setEdu({ ...edu, endDate: e.target.value })}
        />
      </div>
      <textarea
        className="block w-full border p-2 rounded h-20 mt-2"
        placeholder="Description"
        onChange={(e) => setEdu({ ...edu, description: e.target.value })}
      />
      <Button
        variant="secondary"
        className="mt-2 px-4 py-2"
        onClick={() => onAdd(edu)}
      >
        Add Education
      </Button>
    </div>
  );
}
