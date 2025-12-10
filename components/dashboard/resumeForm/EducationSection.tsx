"use client";

import { useState } from "react";
import { EducationItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { GraduationCap, Calendar, Plus } from "lucide-react";

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

  const handleAdd = () => {
    if (!edu.school.trim() || !edu.degree.trim()) {
      toast.error("School & Degree are required");
      return;
    }
    onAdd(edu);
    toast.success("Education added successfully");
    setEdu({ school: "", degree: "", startDate: "", endDate: "", description: "" });
  };

  const inputClasses =
    "px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent focus:ring-2 w-full focus:ring-orange-500/50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary/50";
  const labelClasses = "block mb-1 text-gray-500 text-xs dark:text-gray-400";

  return (
    <div
      // Dark mode styles for container
      className="space-y-4 bg-white shadow-sm p-5 border border-gray-200 rounded-xl
      dark:bg-gray-800 dark:shadow-md dark:border-gray-700"
    >
      <div className="flex items-center gap-2">
        {/* Dark mode icon color */}
        <GraduationCap className="w-5 h-5 text-orange-600 dark:text-primary" />
        {/* Dark mode header text color */}
        <h2 className="font-semibold text-gray-800 text-lg dark:text-white">
          Education
        </h2>
      </div>

      <input
        value={edu.school}
        onChange={(e) => setEdu({ ...edu, school: e.target.value })}
        placeholder="School / University *"
        className={inputClasses}
      />
      <input
        value={edu.degree}
        onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
        placeholder="Degree *"
        className={inputClasses}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          {/* Dark mode label text color */}
          <label className={labelClasses}>Start</label>
          <input
            type="month"
            value={edu.startDate}
            onChange={(e) => setEdu({ ...edu, startDate: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div className="flex-1">
          {/* Dark mode label text color */}
          <label className={labelClasses}>End</label>
          <input
            type="month"
            value={edu.endDate}
            onChange={(e) => setEdu({ ...edu, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <textarea
        value={edu.description}
        onChange={(e) => setEdu({ ...edu, description: e.target.value })}
        placeholder="Description (optional)"
        rows={3}
        className={inputClasses}
      />

      <Button
        variant="secondary"
        className="flex justify-center items-center gap-2 w-full"
        onClick={handleAdd}
      >
        <Plus className="w-4 h-4" /> Add Education
      </Button>
    </div>
  );
}