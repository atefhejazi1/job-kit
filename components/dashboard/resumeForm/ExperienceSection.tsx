"use client";

import { useState } from "react";
import { ExperienceItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { Briefcase, Calendar, Plus } from "lucide-react";

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

  const handleAdd = () => {
    if (!exp.company.trim() || !exp.role.trim()) {
      toast.error("Company & Role are required");
      return;
    }
    onAdd(exp);
    toast.success("Experience added successfully");
    setExp({ company: "", role: "", startDate: "", endDate: "", description: "" });
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
        <Briefcase className="w-5 h-5 text-orange-600 dark:text-primary" />
        {/* Dark mode header text color */}
        <h2 className="font-semibold text-gray-800 text-lg dark:text-white">
          Experience
        </h2>
      </div>

      <input
        value={exp.company}
        onChange={(e) => setExp({ ...exp, company: e.target.value })}
        placeholder="Company *"
        className={inputClasses}
      />
      <input
        value={exp.role}
        onChange={(e) => setExp({ ...exp, role: e.target.value })}
        placeholder="Role *"
        className={inputClasses}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          {/* Dark mode label text color */}
          <label className={labelClasses}>Start</label>
          <input
            type="month"
            value={exp.startDate}
            onChange={(e) => setExp({ ...exp, startDate: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div className="flex-1">
          {/* Dark mode label text color */}
          <label className={labelClasses}>End</label>
          <input
            type="month"
            value={exp.endDate}
            onChange={(e) => setExp({ ...exp, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <textarea
        value={exp.description}
        onChange={(e) => setExp({ ...exp, description: e.target.value })}
        placeholder="Description (optional)"
        rows={3}
        className={inputClasses}
      />

      {/* Assuming Button component is dark mode compatible, keeping existing class structure */}
      <Button
        variant="secondary"
        className="flex justify-center items-center gap-2 w-full"
        onClick={handleAdd}
      >
        <Plus className="w-4 h-4" /> Add Experience
      </Button>
    </div>
  );
}