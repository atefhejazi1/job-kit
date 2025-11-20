"use client";

import { ChangeEvent, useState } from "react";
import { ResumeData, EducationItem, ExperienceItem, ProjectItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import ProjectSection from "./ProjectSection";

interface Props {
    data: ResumeData;
    setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function ResumeForm({ data, setData }: Props) {
    const [skillInput, setSkillInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const addSkill = () => {
        if (!skillInput.trim()) return;
        setData((prev) => ({ ...prev, skills: [...prev.skills, skillInput] }));
        setSkillInput("");
    };

    const addLanguage = () => {
        if (!languageInput.trim()) return;
        setData((prev) => ({ ...prev, languages: [...prev.languages, languageInput] }));
        setLanguageInput("");
    };

    const addEducation = (edu: EducationItem) => setData((prev) => ({ ...prev, education: [...prev.education, edu] }));
    const addExperience = (exp: ExperienceItem) => setData((prev) => ({ ...prev, experience: [...prev.experience, exp] }));
    const addProject = (proj: ProjectItem) => setData((prev) => ({ ...prev, projects: [...prev.projects, proj] }));

    return (
        <div className="space-y-6">
            {/* Personal Info */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Personal Info</h2>
                <input name="name" value={data.name} onChange={handleChange} placeholder="Full Name" className="block w-full border p-2 rounded mb-2" />
                <input name="email" value={data.email} onChange={handleChange} placeholder="Email" className="block w-full border p-2 rounded mb-2" />
                <input name="phone" value={data.phone} onChange={handleChange} placeholder="Phone" className="block w-full border p-2 rounded mb-2" />
                <textarea name="summary" value={data.summary} onChange={handleChange} placeholder="Professional summary..." className="block w-full border p-2 rounded h-24" />
            </div>

            {/* Skills */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Skills</h2>
                <div className="flex gap-2">
                    <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill..." className="flex-1 border p-2 rounded" />
                    <Button variant="secondary" className="px-4 py-2" onClick={addSkill}>Add</Button>
                </div>
                <ul className="mt-2 space-y-1">{data.skills.map((skill, i) => (<li key={i} className="text-gray-700">• {skill}</li>))}</ul>
            </div>

            {/* Languages */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Languages</h2>
                <div className="flex gap-2">
                    <input value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} placeholder="Add a language..." className="flex-1 border p-2 rounded" />
                    <Button variant="secondary" className="px-4 py-2" onClick={addLanguage}>Add</Button>
                </div>
                <ul className="mt-2 space-y-1">{data.languages.map((lang, i) => (<li key={i}>• {lang}</li>))}</ul>
            </div>

            {/* Sections */}
            <EducationSection onAdd={addEducation} />
            <ExperienceSection onAdd={addExperience} />
            <ProjectSection onAdd={addProject} />
        </div>
    );
}
