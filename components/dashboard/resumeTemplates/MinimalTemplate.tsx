"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";

interface MinimalTemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  const colors = TEMPLATES.minimal.colors;

  return (
    <div
      className="w-full bg-white p-8 shadow-lg"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* Header - Minimalist */}
      <div className="mb-8">
        <h1
          className="text-3xl font-light mb-2"
          style={{ color: colors.primary }}
        >
          {data.name || "Your Name"}
        </h1>
        <div className="text-sm space-x-3" style={{ color: colors.secondary }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-light mb-4 pb-1 border-b"
            style={{ color: colors.primary, borderColor: colors.secondary }}
          >
            Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium" style={{ color: colors.text }}>
                    {exp.title}
                  </span>
                  <span className="text-xs" style={{ color: colors.secondary }}>
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <div
                  className="text-sm mb-2"
                  style={{ color: colors.secondary }}
                >
                  {exp.company}
                </div>
                <p className="text-sm" style={{ color: colors.text }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-lg font-light mb-4 pb-1 border-b"
            style={{ color: colors.primary, borderColor: colors.secondary }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium" style={{ color: colors.text }}>
                    {edu.degree}
                  </span>
                  <span className="text-xs" style={{ color: colors.secondary }}>
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <div className="text-sm" style={{ color: colors.secondary }}>
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages - Inline */}
      <div className="space-y-4">
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2
              className="text-lg font-light mb-2 pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.secondary }}
            >
              Skills
            </h2>
            <div className="text-sm" style={{ color: colors.text }}>
              {data.skills.map((s) => s.name).join(" • ")}
            </div>
          </div>
        )}

        {data.languages && data.languages.length > 0 && (
          <div>
            <h2
              className="text-lg font-light mb-2 pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.secondary }}
            >
              Languages
            </h2>
            <div className="text-sm" style={{ color: colors.text }}>
              {data.languages.map((l) => l.name).join(" • ")}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div>
            <h2
              className="text-lg font-light mb-2 pb-1 border-b"
              style={{ color: colors.primary, borderColor: colors.secondary }}
            >
              Projects
            </h2>
            <div className="space-y-2">
              {data.projects.map((proj, idx) => (
                <div key={idx}>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    {proj.title}
                  </span>
                  <span className="text-sm" style={{ color: colors.secondary }}>
                    {" — "}
                    {proj.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
