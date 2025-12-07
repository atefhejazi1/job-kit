"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";

interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  // JSON fields from database - can be arrays or other structures
  skills?:
    | Array<{
        id?: string;
        name: string;
        level?: string;
      }>
    | string[];
  languages?:
    | Array<{
        id?: string;
        name: string;
        level?: string;
      }>
    | string[];
  education?: Array<{
    id?: string;
    school?: string;
    institution?: string;
    degree: string;
    field?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }>;
  experience?: Array<{
    id?: string;
    company: string;
    position?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  projects?: Array<{
    id?: string;
    name?: string;
    title?: string;
    description?: string;
    technologies?: string[];
    link?: string;
    url?: string;
  }>;
}

interface CandidateInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  jobSeeker?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    currentPosition?: string;
    experienceLevel?: string;
    summary?: string;
    skills?: string[];
  };
}

export default function ViewResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const userId = searchParams.get("userId");

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchResume();
    }
  }, [userId]);

  const fetchResume = async () => {
    try {
      // Fetch resume
      const resumeResponse = await fetch(`/api/resume/user/${userId}`, {
        headers: createApiHeadersWithoutContentType(user),
      });

      if (resumeResponse.ok) {
        const resumeData = await resumeResponse.json();
        setResume(resumeData.resume);
      }

      // Fetch candidate info
      const candidateResponse = await fetch(`/api/users/${userId}`, {
        headers: createApiHeadersWithoutContentType(user),
      });

      if (candidateResponse.ok) {
        const candidateData = await candidateResponse.json();
        setCandidate(candidateData.user);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
      toast.error("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!resume && !candidate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Resume not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Actions - Hidden on Print */}
      <div className="print:hidden bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              📥 Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="container mx-auto px-4 py-8 print:py-0">
        <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
          {/* Personal Info Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 print:p-6">
            <div className="flex items-center gap-6">
              {candidate?.avatarUrl ? (
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.name}
                  className="w-24 h-24 rounded-full border-4 border-white print:hidden"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold print:hidden">
                  {(resume?.name || candidate?.name || "?").charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">
                  {resume?.name || candidate?.name || "Unknown"}
                </h1>
                {candidate?.jobSeeker?.currentPosition && (
                  <p className="text-xl opacity-90 mt-1">
                    {candidate.jobSeeker.currentPosition}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-90">
                  <span>📧 {resume?.email || candidate?.email}</span>
                  {(resume?.phone || candidate?.jobSeeker?.phone) && (
                    <span>
                      📞 {resume?.phone || candidate?.jobSeeker?.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 print:p-6">
            {/* Summary */}
            {(resume?.summary || candidate?.jobSeeker?.summary) && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-4">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {resume?.summary || candidate?.jobSeeker?.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {resume?.experience &&
              Array.isArray(resume.experience) &&
              resume.experience.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-4">
                    Work Experience
                  </h2>
                  <div className="space-y-6">
                    {resume.experience.map((exp, index) => (
                      <div
                        key={exp.id || index}
                        className="border-l-2 border-gray-200 pl-4"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {exp.position || exp.title}
                        </h3>
                        <p className="text-orange-600 font-medium">
                          {exp.company}
                        </p>
                        {(exp.startDate || exp.endDate) && (
                          <p className="text-sm text-gray-500">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Education */}
            {resume?.education &&
              Array.isArray(resume.education) &&
              resume.education.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-4">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {resume.education.map((edu, index) => (
                      <div
                        key={edu.id || index}
                        className="border-l-2 border-gray-200 pl-4"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree}
                          {(edu.field || edu.fieldOfStudy) &&
                            ` in ${edu.field || edu.fieldOfStudy}`}
                        </h3>
                        <p className="text-orange-600 font-medium">
                          {edu.school || edu.institution}
                        </p>
                        {(edu.startDate || edu.endDate) && (
                          <p className="text-sm text-gray-500">
                            {edu.startDate} - {edu.endDate || "Present"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Skills */}
            {((resume?.skills &&
              Array.isArray(resume.skills) &&
              resume.skills.length > 0) ||
              (candidate?.jobSeeker?.skills &&
                candidate.jobSeeker.skills.length > 0)) && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-4">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(resume?.skills) &&
                    resume.skills.map((skill, index) => (
                      <span
                        key={
                          typeof skill === "object" ? skill.id || index : index
                        }
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {typeof skill === "string" ? skill : skill.name}
                        {typeof skill === "object" &&
                          skill.level &&
                          ` • ${skill.level}`}
                      </span>
                    ))}
                  {(!resume?.skills ||
                    !Array.isArray(resume.skills) ||
                    resume.skills.length === 0) &&
                    candidate?.jobSeeker?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {resume?.languages &&
              Array.isArray(resume.languages) &&
              resume.languages.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-4">
                    Languages
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {resume.languages.map((lang, index) => (
                      <div
                        key={
                          typeof lang === "object" ? lang.id || index : index
                        }
                        className="text-gray-700"
                      >
                        <span className="font-medium">
                          {typeof lang === "string" ? lang : lang.name}
                        </span>
                        {typeof lang === "object" && lang.level && (
                          <span className="text-gray-500 ml-1">
                            ({lang.level})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Projects */}
            {resume?.projects &&
              Array.isArray(resume.projects) &&
              resume.projects.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2 mb-4">
                    Projects
                  </h2>
                  <div className="space-y-4">
                    {resume.projects.map((project, index) => (
                      <div
                        key={project.id || index}
                        className="border-l-2 border-gray-200 pl-4"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {project.name || project.title}
                          </h3>
                          {(project.link || project.url) && (
                            <a
                              href={project.link || project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700 text-sm"
                            >
                              🔗 View
                            </a>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-gray-700 mt-1">
                            {project.description}
                          </p>
                        )}
                        {project.technologies &&
                          Array.isArray(project.technologies) &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
