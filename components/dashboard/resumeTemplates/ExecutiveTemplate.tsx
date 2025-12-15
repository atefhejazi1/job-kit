"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";
import {
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
} from "lucide-react";

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export default function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  return (
    <div
      className="w-full bg-white p-8 shadow-lg"
      style={{ fontFamily: "Times, serif" }}
    >
      {/* Header - Executive Style */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">
          {data.name || "Your Name"}
        </h1>
        <div className="flex justify-center gap-6 text-gray-700 text-sm">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {data.email || "email@example.com"}
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {data.phone || "+1 (555) 000-0000"}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed font-serif text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-3 border-gray-300 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {exp.role}
                  </h3>
                  <span className="text-sm text-gray-600 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <h4 className="text-md font-semibold text-gray-700 mb-2">
                  {exp.company}
                </h4>
                <p className="text-gray-700 leading-relaxed">
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.school}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {data.skills && data.skills.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {data.skills.map((skill, index) => (
              <div key={index} className="text-gray-700 font-medium">
                • {typeof skill === "string" ? skill : skill.name}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
