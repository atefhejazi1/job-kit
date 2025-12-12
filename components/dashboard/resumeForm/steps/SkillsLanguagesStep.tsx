"use client";

import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { generateId } from "@/contexts/ResumeContext";
import Button from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import type { SkillItem, LanguageItem } from "@/types/resume.data.types";

export default function SkillsLanguagesStep() {
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

  const deleteSkill = (id: string) => {
    const updated = resumeData.skills.filter((s) => s.id !== id);
    setResumeData({ ...resumeData, skills: updated });
  };

  const deleteLanguage = (id: string) => {
    const updated = resumeData.languages.filter((l) => l.id !== id);
    setResumeData({ ...resumeData, languages: updated });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Skills & Languages
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Highlight your technical skills and language proficiencies
        </p>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Skills
        </h3>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            placeholder="Add a skill (e.g., JavaScript, Project Management)..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary"
          />
          <Button variant="secondary" className="px-4 py-2" onClick={addSkill}>
            Add
          </Button>
        </div>

        {/* Skills List */}
        {resumeData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                <span>{skill.name}</span>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Languages
        </h3>
        <div className="flex gap-2">
          <input
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addLanguage()}
            placeholder="Add a language (e.g., English, Arabic)..."
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary"
          />
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={addLanguage}
          >
            Add
          </Button>
        </div>

        {/* Languages List */}
        {resumeData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumeData.languages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
              >
                <span>{lang.name}</span>
                <button
                  onClick={() => deleteLanguage(lang.id)}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label="Delete language"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
