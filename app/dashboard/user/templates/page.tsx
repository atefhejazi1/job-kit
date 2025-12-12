"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/contexts/ResumeContext";
import ModernTemplate from "@/components/dashboard/resumeTemplates/ModernTemplate";
import ClassicTemplate from "@/components/dashboard/resumeTemplates/ClassicTemplate";
import MinimalTemplate from "@/components/dashboard/resumeTemplates/MinimalTemplate";
import CreativeTemplate from "@/components/dashboard/resumeTemplates/CreativeTemplate";
import { ResumeData, CertificationItem } from "@/types/resume.data.types";
import { Palette, ArrowRight, FileText } from "lucide-react";

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
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and timeless design",
    component: ClassicTemplate,
    preview: "bg-gradient-to-br from-gray-700 to-gray-900",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant layout",
    component: MinimalTemplate,
    preview: "bg-gradient-to-br from-gray-400 to-gray-600",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and eye-catching design",
    component: CreativeTemplate,
    preview: "bg-gradient-to-br from-orange-500 to-red-600",
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { setSelectedTemplate } = useResume();
  const [selectedPreview, setSelectedPreview] = useState<string>("modern");

  const handleTemplateSelect = (templateId: string) => {
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
          <p className="text-gray-600 dark:text-gray-400">
            Choose from our professional templates to create your perfect resume
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Templates Grid for Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div
                className={`h-32 ${template.preview} flex items-center justify-center`}
              >
                <div className="text-white text-lg font-semibold">
                  {template.name}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
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
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {/* Templates Grid */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Available Templates
            </h2>
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPreview === template.id
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedPreview(template.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-16 h-20 rounded-lg ${template.preview} flex-shrink-0`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        Use Template
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
          <div className="col-span-2">
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
                  <div
                    className="overflow-y-auto"
                    style={{
                      maxHeight: "500px",
                      transform: "scale(0.8)",
                      transformOrigin: "top center",
                      margin: "-10% auto",
                      width: "125%",
                    }}
                  >
                    <div className="bg-white">
                      <SelectedComponent data={sampleData} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      ✨ Template Features
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                      <li>• Professional ATS-friendly design</li>
                      <li>• Customizable colors and sections</li>
                      <li>• Export to PDF and Word</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                      🚀 Quick Start
                    </h3>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Click "Use Template" to start building your resume with
                      this design. You can customize all content and styling.
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
