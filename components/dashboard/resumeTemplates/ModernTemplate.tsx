"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";
import {
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
} from "lucide-react";

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  const colors = TEMPLATES.modern.colors;

  return (
    <div
      className="w-full bg-white p-8 shadow-lg"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Header with accent bar */}
      <div
        className="border-l-4 pl-6 mb-6"
        style={{ borderColor: colors.primary }}
      >
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          {data.name || "Your Name"}
        </h1>
        <div
          className="flex flex-wrap gap-4 text-sm"
          style={{ color: colors.secondary }}
        >
          {data.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{data.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2
            className="text-xl font-semibold mb-3 pb-2 border-b-2"
            style={{ color: colors.primary, borderColor: colors.accent }}
          >
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
            {data.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h2
                className="text-xl font-semibold mb-3 pb-2 border-b-2 flex items-center gap-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                <Briefcase className="w-5 h-5" />
                Work Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx}>
                    <h3
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {exp.title}
                    </h3>
                    <div
                      className="text-sm"
                      style={{ color: colors.secondary }}
                    >
                      {exp.company} | {exp.startDate} - {exp.endDate}
                    </div>
                    <p className="text-sm mt-1" style={{ color: colors.text }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <h2
                className="text-xl font-semibold mb-3 pb-2 border-b-2 flex items-center gap-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                <GraduationCap className="w-5 h-5" />
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx}>
                    <h3
                      className="font-semibold"
                      style={{ color: colors.text }}
                    >
                      {edu.degree}
                    </h3>
                    <div
                      className="text-sm"
                      style={{ color: colors.secondary }}
                    >
                      {edu.institution} | {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h2
                className="text-lg font-semibold mb-3 pb-2 border-b-2 flex items-center gap-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                <Code className="w-4 h-4" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: colors.primary + "20",
                      color: colors.primary,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2
                className="text-lg font-semibold mb-3 pb-2 border-b-2 flex items-center gap-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                <Globe className="w-4 h-4" />
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="text-sm"
                    style={{ color: colors.text }}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div>
              <h2
                className="text-lg font-semibold mb-3 pb-2 border-b-2"
                style={{ color: colors.primary, borderColor: colors.accent }}
              >
                Projects
              </h2>
              <div className="space-y-2">
                {data.projects.map((proj, idx) => (
                  <div key={idx}>
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: colors.text }}
                    >
                      {proj.name}
                    </h3>
                    <p className="text-xs" style={{ color: colors.secondary }}>
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
