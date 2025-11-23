"use client";

import { useResume } from "@/contexts/ResumeContext";
import Button from "@/components/ui/Button";

export default function ResumePreview() {
  const { resumeData } = useResume();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-gray-900 shadow-md rounded-md">
      <div id="resume-preview">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{resumeData.name}</h1>
          <p className="text-sm text-gray-700">
            {resumeData.email} · {resumeData.phone}
          </p>
        </header>

        {/* Summary */}
        {resumeData.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
            <p>{resumeData.summary}</p>
          </section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
            <ul className="list-disc list-inside flex flex-wrap gap-2">
              {resumeData.skills.map((s, i) => (
                <li key={i} className="bg-gray-100 px-2 py-1 rounded">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {resumeData.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Languages</h2>
            <ul className="list-disc list-inside flex flex-wrap gap-2">
              {resumeData.languages.map((lang, i) => (
                <li key={i} className="bg-gray-100 px-2 py-1 rounded">
                  {lang}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">
                  {edu.school} — {edu.degree}
                </p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p>{edu.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Experience</h2>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">
                  {exp.company} — {exp.role}
                </p>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b pb-1 mb-2">Projects</h2>
            {resumeData.projects.map((p, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">{p.title}</p>
                {p.link && (
                  <a
                    href={p.link}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.link}
                  </a>
                )}
                <p>{p.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
      {/* Print/Download */}
      
    </div>
  );
}
