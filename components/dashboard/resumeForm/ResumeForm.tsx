"use client";

import { ChangeEvent, useState } from "react";
import {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "@/types/resume.data.types";
import { useResume } from "@/contexts/ResumeContext";
import Button from "@/components/ui/Button";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import ProjectSection from "./ProjectSection";
import EducationList from "./EducationList";
import ExperienceList from "./ExperienceList";
import ProjectList from "./ProjectList";

export default function ResumeForm() {
  const { resumeData, setResumeData } = useResume();
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, skillInput],
    });
    setSkillInput("");
  };

  const addLanguage = () => {
    if (!languageInput.trim()) return;
    setResumeData({
      ...resumeData,
      languages: [...resumeData.languages, languageInput],
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
      {/* Personal Info */}
      <div>
        <h2 className="mb-3 font-semibold text-xl">Personal Info</h2>
        <input
          name="name"
          value={resumeData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="email"
          value={resumeData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="phone"
          value={resumeData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="block mb-2 p-2 border rounded w-full"
        />
        <textarea
          name="summary"
          value={resumeData.summary}
          onChange={handleChange}
          placeholder="Professional summary..."
          className="block p-2 border rounded w-full h-24"
        />
      </div>

      {/* Skills */}
      <div>
        <h2 className="mb-3 font-semibold text-xl">Skills</h2>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="Add a skill..."
            className="flex-1 p-2 border rounded"
          />
          <Button variant="secondary" className="px-4 py-2" onClick={addSkill}>
            Add
          </Button>
        </div>
        <ul className="space-y-2 mt-2">
          {resumeData.skills.map((skill, i) => (
            <li key={i} className="flex items-center gap-2">
              <span>• {skill}</span>
              <button
                onClick={() => {
                  const updated = resumeData.skills.filter(
                    (_, idx) => idx !== i
                  );
                  setResumeData({ ...resumeData, skills: updated });
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Languages */}
      <div>
        <h2 className="mb-3 font-semibold text-xl">Languages</h2>
        <div className="flex gap-2">
          <input
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            placeholder="Add a language..."
            className="flex-1 p-2 border rounded"
          />
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={addLanguage}
          >
            Add
          </Button>
        </div>
        <ul className="space-y-2 mt-2">
          {resumeData.languages.map((lang, i) => (
            <li key={i} className="flex items-center gap-2">
              <span>• {lang}</span>
              <button
                onClick={() => {
                  const updated = resumeData.languages.filter(
                    (_, idx) => idx !== i
                  );
                  setResumeData({ ...resumeData, languages: updated });
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      {/* Education:  Add  then List */}
      <div>
        <EducationSection onAdd={addEducation} />
        <div className="mt-6"></div>
        <EducationList
          education={resumeData.education}
          onDelete={deleteEducation}
        />
      </div>

      {/* Experience: Add then List */}
      <div>
        <ExperienceSection onAdd={addExperience} />
        <div className="mt-6"></div>
        <ExperienceList
          experience={resumeData.experience}
          onDelete={deleteExperience}
        />
      </div>

      {/* Projects: Add then List */}
      <div>
        <ProjectSection onAdd={addProject} />
        <div className="mt-6"></div>
        <ProjectList projects={resumeData.projects} onDelete={deleteProject} />
      </div>
    </div>
  );
}
