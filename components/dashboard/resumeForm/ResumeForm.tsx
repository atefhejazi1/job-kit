"use client";

import { useState } from "react";
import {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SkillItem,
  LanguageItem,
} from "@/types/resume.data.types";
import { useResume } from "@/contexts/ResumeContext";
import Button from "@/components/ui/Button";
import PersonalInfo from "./PersonalInfo";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import ProjectSection from "./ProjectSection";
import EducationList from "./EducationList";
import ExperienceList from "./ExperienceList";
import ProjectList from "./ProjectList";
import { generateId } from "@/contexts/ResumeContext";
import CertificationSection from "./CertificationSection";
import CertificationList from "./CertificationList ";
import { Trash2 } from "lucide-react";

export default function ResumeForm() {
  const { resumeData, setResumeData } = useResume();
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const addSkill = () => {
    if (!skillInput.trim()) return;

    const newSkill: SkillItem = {
      type: "skill",
      id: generateId(),
      name: skillInput.trim(),
    };

    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
    setSkillInput("");
  };

  const addLanguage = () => {
    if (!languageInput.trim()) return;

    const newLanguage: LanguageItem = {
      type: "language",
      id: generateId(),
      name: languageInput.trim(),
    };

    setResumeData({
      ...resumeData,
      languages: [...resumeData.languages, newLanguage],
    });
    setLanguageInput("");
  };

  const addEducation = (edu: EducationItem) =>
    setResumeData({ ...resumeData, education: [...resumeData.education, edu] });

  const addExperience = (exp: ExperienceItem) =>
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, exp],
    });

  const addProject = (proj: ProjectItem) =>
    setResumeData({ ...resumeData, projects: [...resumeData.projects, proj] });

  const deleteEducation = (index: number) => {
    const updated = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: updated });
  };

  const deleteExperience = (index: number) => {
    const updated = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: updated });
  };

  const deleteProject = (index: number) => {
    const updated = resumeData.projects.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, projects: updated });
  };

  return (
    <div className="space-y-6">
      {/* Assuming PersonalInfo, EducationSection, etc., are also dark mode compatible components */}
      <PersonalInfo />
      
      {/* Skills Section */}
      <div>
        <h2 className="mb-3 font-semibold text-xl dark:text-white">Skills</h2>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-orange-500/50"
          />
          {/* Assuming Button component handles its own dark mode secondary style */}
          <Button variant="secondary" className="px-4 py-2" onClick={addSkill}>
            Add
          </Button>
        </div>
        <ul className="space-y-2 mt-2">
          {resumeData.skills.map((skill) => (
            <li key={skill.id} className="group flex items-center gap-2 dark:text-gray-300">
              <span>• {skill.name}</span>
              <button
                onClick={() => {
                  const updated = resumeData.skills.filter(
                    (s) => s.id !== skill.id
                  );
                  setResumeData({ ...resumeData, skills: updated });
                }}
                className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity cursor-pointer dark:text-red-500 dark:hover:text-red-400"
                aria-label="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Languages Section */}
      <div>
        <h2 className="mb-3 font-semibold text-xl dark:text-white">Languages</h2>
        <div className="flex gap-2">
          <input
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Add a language..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-orange-500/50"
          />
          {/* Assuming Button component handles its own dark mode secondary style */}
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={addLanguage}
          >
            Add
          </Button>
        </div>
        <ul className="space-y-2 mt-2">
          {resumeData.languages.map((lang) => (
            <li key={lang.id} className="group flex items-center gap-2 dark:text-gray-300">
              <span>• {lang.name}</span>
              <button
                onClick={() => {
                  const updated = resumeData.languages.filter(
                    (l) => l.id !== lang.id
                  );
                  setResumeData({ ...resumeData, languages: updated });
                }}
                className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity cursor-pointer dark:text-red-500 dark:hover:text-red-400"
                aria-label="Delete language"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Education */}
      <div>
        <EducationSection onAdd={addEducation} />
        <div className="mt-6"></div>
        <EducationList
          education={resumeData.education}
          onDelete={deleteEducation}
        />
      </div>

      {/* Certifications */}
      <div>
        <CertificationSection />
        <div className="mt-6"></div>
        <CertificationList certifications={resumeData.certifications} />
      </div>

      {/* Experience */}
      <div>
        <ExperienceSection onAdd={addExperience} />
        <div className="mt-6"></div>
        <ExperienceList
          experience={resumeData.experience}
          onDelete={deleteExperience}
        />
      </div>

      {/* Projects */}
      <div>
        <ProjectSection onAdd={addProject} />
        <div className="mt-6"></div>
        <ProjectList projects={resumeData.projects} onDelete={deleteProject} />
      </div>
    </div>
  );
}