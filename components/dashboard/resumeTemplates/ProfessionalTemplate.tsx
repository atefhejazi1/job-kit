"use client";

import { ResumeData } from "@/types/resume.data.types";
import { TEMPLATES } from "@/types/resume.template.types";
import {
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  User,
  Award,
} from "lucide-react";

interface ProfessionalTemplateProps {
  data: ResumeData;
}

export default function ProfessionalTemplate({
  data,
}: ProfessionalTemplateProps) {
  return (
    <div
      className="w-full bg-white shadow-lg"
      style={{ fontFamily: "Calibri, sans-serif" }}
    >
      {/* Header with sidebar */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-100 p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {data.name || "Your Name"}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              Contact
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                {data.email || "email@example.com"}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                {data.phone || "+1 (555) 000-0000"}
              </div>
            </div>
          </div>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Skills
              </h2>
              <div className="space-y-2">
                {data.skills.slice(0, 8).map((skill, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    • {typeof skill === "string" ? skill : skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Languages
              </h2>
              <div className="space-y-1">
                {data.languages.map((lang, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {typeof lang === "string" ? lang : lang.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-6">
          {/* Professional Summary */}
          {data.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {data.summary}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-600" />
                Professional Experience
              </h2>
              <div className="space-y-5">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-md font-bold text-gray-900">
                        {exp.role}
                      </h3>
                      <span className="text-sm text-gray-600 font-medium">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">
                      {exp.company}
                    </h4>
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
              <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {edu.degree}
                        </h3>
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

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 border-b-2 border-gray-300 pb-2 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-600" />
                Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900">{project.title}</h3>
                    <p className="text-gray-700 text-sm">
                      {project.description}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
