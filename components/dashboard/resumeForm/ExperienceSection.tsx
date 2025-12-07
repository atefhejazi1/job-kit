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

  return (
    <div className="space-y-4 bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-orange-600" />
        <h2 className="font-semibold text-gray-800 text-lg">Experience</h2>
      </div>

      <input
        value={exp.company}
        onChange={(e) => setExp({ ...exp, company: e.target.value })}
        placeholder="Company *"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
      />
      <input
        value={exp.role}
        onChange={(e) => setExp({ ...exp, role: e.target.value })}
        placeholder="Role *"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block mb-1 text-gray-500 text-xs">Start</label>
          <input
            type="month"
            value={exp.startDate}
            onChange={(e) => setExp({ ...exp, startDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-500 text-xs">End</label>
          <input
            type="month"
            value={exp.endDate}
            onChange={(e) => setExp({ ...exp, endDate: e.target.value })}
            className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
          />
        </div>
      </div>

      <textarea
        value={exp.description}
        onChange={(e) => setExp({ ...exp, description: e.target.value })}
        placeholder="Description (optional)"
        rows={3}
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 w-full"
      />

      <Button variant="secondary" className="flex justify-center items-center gap-2 w-full" onClick={handleAdd}>
        <Plus className="w-4 h-4" /> Add Experience
      </Button>
    </div>
  );
}