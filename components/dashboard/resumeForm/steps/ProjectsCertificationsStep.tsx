"use client";

import { useResume } from "@/contexts/ResumeContext";
import ProjectSection from "../ProjectSection";
import ProjectList from "../ProjectList";
import CertificationSection from "../CertificationSection";
import CertificationList from "../CertificationList ";
import type { ProjectItem } from "@/types/resume.data.types";

export default function ProjectsCertificationsStep() {
  const { resumeData, setResumeData } = useResume();

  const addProject = (proj: ProjectItem) =>
    setResumeData({ ...resumeData, projects: [...resumeData.projects, proj] });

  const deleteProject = (index: number) => {
    const updated = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Projects & Certifications
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showcase your notable projects and professional certifications
        </p>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Projects
        </h3>
        <ProjectSection onAdd={addProject} />
        <ProjectList projects={resumeData.projects} onDelete={deleteProject} />
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Certifications
        </h3>
        <CertificationSection />
        <CertificationList />
      </div>
    </div>
  );
}
