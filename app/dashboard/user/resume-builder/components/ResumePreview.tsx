"use client";

import Button from "@/components/ui/Button";
import { ResumeData } from "@/types/resume.data.types";

export default function ResumePreview({ data }: { data: ResumeData }) {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white text-gray-900 shadow-md rounded-md">
            <div id="resume-preview">
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <p className="text-sm text-gray-700">{data.email} · {data.phone}</p>
                </header>

                {/* Summary */}
                {data.summary && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
                        <p>{data.summary}</p>
                    </section>
                )}

                {/* Skills */}
                {data.skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Skills</h2>
                        <ul className="list-disc list-inside flex flex-wrap gap-2">
                            {data.skills.map((s, i) => (
                                <li key={i} className="bg-gray-100 px-2 py-1 rounded">{s}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Languages */}
                {data.languages.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Languages</h2>
                        <ul className="list-disc list-inside flex flex-wrap gap-2">
                            {data.languages.map((lang, i) => (
                                <li key={i} className="bg-gray-100 px-2 py-1 rounded">{lang}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Education</h2>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold">{edu.school} — {edu.degree}</p>
                                <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
                                <p>{edu.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Experience</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold">{exp.company} — {exp.role}</p>
                                <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                <p>{exp.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects */}
                {data.projects.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-semibold border-b pb-1 mb-2">Projects</h2>
                        {data.projects.map((p, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold">{p.title}</p>
                                {p.link && (
                                    <a href={p.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
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
            <div className="mt-6">
                <Button
                    variant="primary"
                    onClick={() => window.print()}
                    className="px-4 py-2"
                >
                    Download PDF
                </Button>
            </div>
        </div>
    );
}
