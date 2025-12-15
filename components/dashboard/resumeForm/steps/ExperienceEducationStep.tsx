"use client";

import { useResume } from "@/contexts/ResumeContext";
import EducationSection from "../EducationSection";
import EducationList from "../EducationList";
import ExperienceSection from "../ExperienceSection";
import ExperienceList from "../ExperienceList";
import type { EducationItem, ExperienceItem } from "@/types/resume.data.types";

export default function ExperienceEducationStep() {
  const { resumeData, setResumeData } = useResume();

  const addEducation = (edu: EducationItem) =>
    setResumeData({ ...resumeData, education: [...resumeData.education, edu] });

  const addExperience = (exp: ExperienceItem) =>
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, exp],
    });

  const deleteEducation = (index: number) => {
    const updated = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: updated });
  };

  const deleteExperience = (index: number) => {
    const updated = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Experience & Education
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your work experience and educational background
        </p>
      </div>

      {/* Work Experience */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Work Experience
        </h3>
        <ExperienceSection onAdd={addExperience} />
        <ExperienceList
          experience={resumeData.experience}
          onDelete={deleteExperience}
        />
      </div>

      {/* Education */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Education
        </h3>
        <EducationSection onAdd={addEducation} />
        <EducationList
          education={resumeData.education}
          onDelete={deleteEducation}
        />
      </div>
    </div>
  );
}
