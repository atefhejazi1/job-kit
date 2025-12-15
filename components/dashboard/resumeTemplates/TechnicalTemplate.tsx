"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";
import {
  Mail,
  Phone,
  Code,
  Database,
  Globe,
  Github,
  Briefcase,
} from "lucide-react";

interface TechnicalTemplateProps {
  data: ResumeData;
}

export default function TechnicalTemplate({ data }: TechnicalTemplateProps) {
  return (
    <div
      className="w-full bg-white p-8 shadow-lg"
      style={{ fontFamily: "Consolas, monospace" }}
    >
      {/* Header - Tech Style */}
      <div className="bg-gray-900 text-white p-6 -m-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {data.name || "Developer Name"}
            </h1>
            <p className="text-gray-300 font-mono text-sm">
              // Full Stack Developer
            </p>
          </div>
          <div className="text-right space-y-1 text-sm">
            <div className="flex items-center gap-2 justify-end">
              <Mail className="w-4 h-4" />
              {data.email || "dev@example.com"}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Phone className="w-4 h-4" />
              {data.phone || "+1 (555) 000-0000"}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Github className="w-4 h-4" />
              github.com/username
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            SUMMARY
          </h2>
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="text-gray-700 font-mono text-sm leading-relaxed">
              {data.summary}
            </p>
          </div>
        </section>
      )}

      {/* Technical Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            TECHNICAL SKILLS
          </h2>
          <div className="bg-gray-50 p-4 rounded border-l-4 border-green-600">
            <div className="grid grid-cols-4 gap-3">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="font-mono text-sm text-gray-800 bg-white px-2 py-1 rounded border"
                >
                  {typeof skill === "string" ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div
                key={index}
                className="border-l-4 border-purple-600 pl-4 bg-purple-50 p-3 rounded-r"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 font-mono">
                      {exp.role}
                    </h3>
                    <p className="text-purple-700 font-semibold">
                      {exp.company}
                    </p>
                  </div>
                  <span className="text-sm font-mono text-gray-600 bg-white px-2 py-1 rounded">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="font-mono text-sm text-gray-700 whitespace-pre-line">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-600" />
            PROJECTS
          </h2>
          <div className="space-y-3">
            {data.projects.map((project, index) => (
              <div key={index} className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-bold text-gray-900 font-mono">
                  {project.title}
                </h3>
                <p className="text-gray-700 text-sm font-mono">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-blue-600 font-mono text-sm hover:underline"
                  >
                    → {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">EDUCATION</h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="flex justify-between items-center font-mono text-sm"
              >
                <div>
                  <span className="font-bold">{edu.degree}</span> - {edu.school}
                </div>
                <span className="text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
