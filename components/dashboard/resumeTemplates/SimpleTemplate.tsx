"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";

interface SimpleTemplateProps {
  data: ResumeData;
}

export default function SimpleTemplate({ data }: SimpleTemplateProps) {
  return (
    <div
      className="w-full bg-white p-8 shadow-lg"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.name || "Your Name"}
        </h1>
        <div className="text-gray-600 space-y-1">
          <div>{data.email || "email@example.com"}</div>
          <div>{data.phone || "+1 (555) 000-0000"}</div>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            SUMMARY
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            WORK EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <p className="font-semibold text-gray-700 mb-2">
                  {exp.company}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.school}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            SKILLS
          </h2>
          <div className="text-gray-700">
            {data.skills.map((skill, index) => (
              <span key={index}>
                {typeof skill === "string" ? skill : skill.name}
                {index < data.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
            LANGUAGES
          </h2>
          <div className="text-gray-700">
            {data.languages.map((lang, index) => (
              <span key={index}>
                {typeof lang === "string" ? lang : lang.name}
                {index < data.languages.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
