"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/contexts/ResumeContext";
import ModernTemplate from "@/components/dashboard/resumeTemplates/ModernTemplate";
import ClassicTemplate from "@/components/dashboard/resumeTemplates/ClassicTemplate";
import MinimalTemplate from "@/components/dashboard/resumeTemplates/MinimalTemplate";
import CreativeTemplate from "@/components/dashboard/resumeTemplates/CreativeTemplate";
import ExecutiveTemplate from "@/components/dashboard/resumeTemplates/ExecutiveTemplate";
import TechnicalTemplate from "@/components/dashboard/resumeTemplates/TechnicalTemplate";
import SimpleTemplate from "@/components/dashboard/resumeTemplates/SimpleTemplate";
import ProfessionalTemplate from "@/components/dashboard/resumeTemplates/ProfessionalTemplate";
import { ResumeData, CertificationItem } from "@/types/resume.data.types";
import {
  Palette,
  ArrowRight,
  FileText,
  CheckCircle,
  Shield,
} from "lucide-react";

const sampleData: ResumeData = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  summary:
    "Experienced software developer with expertise in full-stack development and modern web technologies.",
  experience: [
    {
      type: "experience",
      company: "Tech Corp",
      role: "Senior Developer",
      startDate: "2020",
      endDate: "Present",
      description:
        "Led development of multiple web applications using React and Node.js.",
    },
    {
      type: "experience",
      company: "StartupXYZ",
      role: "Frontend Developer",
      startDate: "2018",
      endDate: "2020",
      description:
        "Built responsive web interfaces and improved user experience.",
    },
  ],
  education: [
    {
      type: "education",
      school: "University of Technology",
      degree: "Bachelor of Computer Science",
      startDate: "2014",
      endDate: "2018",
      description: "Computer Science and Software Engineering",
    },
  ],
  skills: [
    { type: "skill", id: "1", name: "JavaScript" },
    { type: "skill", id: "2", name: "React" },
    { type: "skill", id: "3", name: "Node.js" },
    { type: "skill", id: "4", name: "TypeScript" },
    { type: "skill", id: "5", name: "CSS" },
    { type: "skill", id: "6", name: "HTML" },
  ],
  languages: [
    { type: "language", id: "1", name: "English (Native)" },
    { type: "language", id: "2", name: "Spanish (Conversational)" },
  ],
  projects: [
    {
      type: "project",
      title: "E-Commerce Platform",
      link: "https://github.com/johndoe/ecommerce",
      description: "Full-stack e-commerce solution with React and Node.js",
    },
  ],
  certifications: [],
};

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with accent colors",
    component: ModernTemplate,
    preview: "bg-gradient-to-br from-blue-500 to-purple-600",
    atsCompliant: true,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and timeless design",
    component: ClassicTemplate,
    preview: "bg-gradient-to-br from-gray-700 to-gray-900",
    atsCompliant: true,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant layout",
    component: MinimalTemplate,
    preview: "bg-gradient-to-br from-gray-400 to-gray-600",
    atsCompliant: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and eye-catching design",
    component: CreativeTemplate,
    preview: "bg-gradient-to-br from-orange-500 to-red-600",
    atsCompliant: true,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for senior positions",
    component: ExecutiveTemplate,
    preview: "bg-gradient-to-br from-slate-800 to-slate-900",
    atsCompliant: true,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Developer-focused with code styling",
    component: TechnicalTemplate,
    preview: "bg-gradient-to-br from-emerald-600 to-teal-700",
    atsCompliant: true,
  },
  {
    id: "simple",
    name: "Simple",
    description: "Clean and straightforward for beginners",
    component: SimpleTemplate,
    preview: "bg-gradient-to-br from-neutral-400 to-neutral-500",
    atsCompliant: true,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Two-column layout for experienced professionals",
    component: ProfessionalTemplate,
    preview: "bg-gradient-to-br from-indigo-500 to-blue-600",
    atsCompliant: true,
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { setSelectedTemplate } = useResume();
  const [selectedPreview, setSelectedPreview] = useState<string>("modern");

  const handleTemplateSelect = (templateId: any) => {
    setSelectedTemplate(templateId);
    router.push("/dashboard/user/resume-builder");
  };

  const selectedTemplateData = templates.find((t) => t.id === selectedPreview);
  const SelectedComponent = selectedTemplateData?.component || ModernTemplate;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Resume Templates
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              Choose from our professional ATS-compliant templates to create
              your perfect resume
            </p>
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
              <Shield className="w-4 h-4" />
              <span className="font-medium">All ATS Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Templates Grid for Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:hidden gap-4 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div
                className={`h-32 ${template.preview} flex items-center justify-center relative`}
              >
                <div className="text-white text-lg font-semibold">
                  {template.name}
                </div>
                {template.atsCompliant && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    ATS
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  {template.atsCompliant && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">ATS Ready</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {/* Templates Grid */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Available Templates
            </h2>
            <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedPreview === template.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedPreview(template.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-16 h-20 rounded border border-gray-200 dark:border-gray-600 bg-white flex-shrink-0 relative overflow-hidden">
                      <div className="transform scale-[0.12] origin-top-left w-[500%] h-[500%]">
                        <div className="bg-white">
                          <template.component data={sampleData} />
                        </div>
                      </div>
                      {template.atsCompliant && (
                        <div className="absolute -top-0.5 -right-0.5 bg-green-500 text-white p-0.5 rounded-full z-10">
                          <Shield className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
                        {template.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className="w-full px-2 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Use
                      </button>
                    </div>
                  </div>

                  {selectedPreview === template.id && (
                    <div className="mt-2 pt-2 border-t border-primary/20">
                      <div className="flex items-center gap-2 text-primary text-sm">
                        <ArrowRight className="w-4 h-4" />
                        <span>Preview Active</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Template Preview
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
                      {selectedTemplateData?.name}
                    </span>
                    <button
                      onClick={() => handleTemplateSelect(selectedPreview)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Use Template
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                  <div className="p-4">
                    <div className="bg-white shadow-lg max-w-4xl mx-auto">
                      <SelectedComponent data={sampleData} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      ATS Compliant Features
                    </h3>
                    <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
                      <li>• 100% ATS-friendly formatting</li>
                      <li>• Standard fonts and layouts</li>
                      <li>• No graphics or complex tables</li>
                      <li>• Keyword optimization ready</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      🚀 Quick Start
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      All templates are ATS-optimized to pass through Applicant
                      Tracking Systems. Click "Use Template" to start building
                      your professional resume.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
