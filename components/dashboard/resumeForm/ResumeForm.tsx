"use client";

import { ChangeEvent, useState } from "react";
import { EducationItem, ExperienceItem, ProjectItem } from "@/types/resume.data.types";
import { useResume } from "@/contexts/ResumeContext";
import Button from "@/components/ui/Button";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import ProjectSection from "./ProjectSection";

export default function ResumeForm() {
  const { resumeData, setResumeData } = useResume();
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setResumeData({ ...resumeData, skills: [...resumeData.skills, skillInput] });
    setSkillInput("");
  };

  const addLanguage = () => {
    if (!languageInput.trim()) return;
    setResumeData({ ...resumeData, languages: [...resumeData.languages, languageInput] });
    setLanguageInput("");
  };

  const addEducation = (edu: EducationItem) =>
    setResumeData({ ...resumeData, education: [...resumeData.education, edu] });

  const addExperience = (exp: ExperienceItem) =>
    setResumeData({ ...resumeData, experience: [...resumeData.experience, exp] });

  const addProject = (proj: ProjectItem) =>
    setResumeData({ ...resumeData, projects: [...resumeData.projects, proj] });

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Personal Info</h2>
        <input
          name="name"
          value={resumeData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="block w-full border p-2 rounded mb-2"
        />
        <input
          name="email"
          value={resumeData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full border p-2 rounded mb-2"
        />
        <input
          name="phone"
          value={resumeData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="block w-full border p-2 rounded mb-2"
        />
        <textarea
          name="summary"
          value={resumeData.summary}
          onChange={handleChange}
          placeholder="Professional summary..."
          className="block w-full border p-2 rounded h-24"
        />
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Skills</h2>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1 border p-2 rounded"
          />
          <Button variant="secondary" className="px-4 py-2" onClick={addSkill}>
            Add
          </Button>
        </div>
        <ul className="mt-2 space-y-1">
          {resumeData.skills.map((skill, i) => (
            <li key={i} className="text-gray-700">
              • {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Languages</h2>
        <div className="flex gap-2">
          <input
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Add a language..."
            className="flex-1 border p-2 rounded"
          />
          <Button variant="secondary" className="px-4 py-2" onClick={addLanguage}>
            Add
          </Button>
        </div>
        <ul className="mt-2 space-y-1">
          {resumeData.languages.map((lang, i) => (
            <li key={i}>• {lang}</li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      <EducationSection onAdd={addEducation} />
      <ExperienceSection onAdd={addExperience} />
      <ProjectSection onAdd={addProject} />
    </div>
  );
}
