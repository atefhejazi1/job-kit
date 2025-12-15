"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";
import { Sparkles, Zap } from "lucide-react";

interface CreativeTemplateProps {
  data: ResumeData;
}

export default function CreativeTemplate({ data }: CreativeTemplateProps) {
  const colors = TEMPLATES.creative.colors;

  return (
    <div
      className="w-full shadow-lg"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header - Bold & Creative */}
      <div
        className="p-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-4xl font-bold">{data.name || "Your Name"}</h1>
        </div>
        <div className="text-sm opacity-90 space-x-3">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>•</span>}
          {data.phone && <span>{data.phone}</span>}
        </div>
      </div>

      <div className="p-8">
        {/* Summary with icon */}
        {data.summary && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{ backgroundColor: colors.accent + "20" }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.text }}
            >
              {data.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5" style={{ color: colors.primary }} />
              <h2
                className="text-2xl font-bold"
                style={{ color: colors.primary }}
              >
                Experience
              </h2>
            </div>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    backgroundColor: "white",
                    borderColor: idx % 2 === 0 ? colors.primary : colors.accent,
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="font-bold text-lg"
                      style={{ color: colors.text }}
                    >
                      {exp.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: colors.secondary + "30",
                        color: colors.secondary,
                      }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div
                    className="text-sm font-medium mb-2"
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
              className="text-2xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "white" }}
                >
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold" style={{ color: colors.text }}>
                      {edu.degree}
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: colors.secondary }}
                    >
                      {edu.startDate} - {edu.endDate}
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

        {/* Skills & Languages Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-white p-4 rounded-lg">
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: colors.primary }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: [
                        colors.primary,
                        colors.secondary,
                        colors.accent,
                      ][idx % 3],
                      color: "white",
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
            <div className="bg-white p-4 rounded-lg">
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: colors.primary }}
              >
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="text-sm px-3 py-1 rounded"
                    style={{
                      backgroundColor: colors.accent + "20",
                      color: colors.text,
                    }}
                  >
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="bg-white p-4 rounded-lg">
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: colors.primary }}
            >
              Featured Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border-2"
                  style={{ borderColor: colors.accent }}
                >
                  <h3
                    className="text-sm font-bold mb-1"
                    style={{ color: colors.text }}
                  >
                    {proj.title}
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
  );
}
