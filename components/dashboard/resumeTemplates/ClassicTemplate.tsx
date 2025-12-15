"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";

interface ClassicTemplateProps {
  data: ResumeData;
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  const colors = TEMPLATES.classic.colors;

  return (
    <div
      className="w-full bg-white p-8 shadow-lg"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Header - Centered */}
      <div
        className="text-center mb-8 pb-4 border-b-2"
        style={{ borderColor: colors.primary }}
      >
        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: colors.primary }}
        >
          {data.name || "Your Name"}
        </h1>
        <div className="text-sm space-x-4" style={{ color: colors.secondary }}>
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: colors.primary }}
          >
            Professional Summary
          </h2>
          <p
            className="text-sm leading-relaxed text-justify"
            style={{ color: colors.text }}
          >
            {data.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: colors.primary }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold" style={{ color: colors.text }}>
                    {exp.title}
                  </h3>
                  <span
                    className="text-sm italic"
                    style={{ color: colors.secondary }}
                  >
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div
                  className="text-sm italic mb-2"
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
        <div className="mb-6">
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: colors.primary }}
          >
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold" style={{ color: colors.text }}>
                    {edu.degree}
                  </h3>
                  <span
                    className="text-sm italic"
                    style={{ color: colors.secondary }}
                  >
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div
                  className="text-sm italic"
                  style={{ color: colors.secondary }}
                >
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-3 uppercase tracking-wide"
              style={{ color: colors.primary }}
            >
              Skills
            </h2>
            <ul
              className="list-disc list-inside text-sm space-y-1"
              style={{ color: colors.text }}
            >
              {data.skills.map((skill, idx) => (
                <li key={idx}>{skill.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h2
              className="text-xl font-bold mb-3 uppercase tracking-wide"
              style={{ color: colors.primary }}
            >
              Languages
            </h2>
            <ul
              className="list-disc list-inside text-sm space-y-1"
              style={{ color: colors.text }}
            >
              {data.languages.map((lang, idx) => (
                <li key={idx}>{lang.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div>
          <h2
            className="text-xl font-bold mb-3 uppercase tracking-wide"
            style={{ color: colors.primary }}
          >
            Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj, idx) => (
              <div key={idx}>
                <h3
                  className="font-bold text-sm"
                  style={{ color: colors.text }}
                >
                  {proj.title}
                </h3>
                <p className="text-sm" style={{ color: colors.secondary }}>
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
