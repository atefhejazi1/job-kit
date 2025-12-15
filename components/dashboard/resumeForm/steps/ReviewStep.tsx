"use client";

import { useResume } from "@/contexts/ResumeContext";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function ReviewStep() {
  const { resumeData } = useResume();

  // Calculate completion status
  const hasPersonalInfo =
    resumeData.name && resumeData.email && resumeData.phone;
  const hasSummary = resumeData.summary && resumeData.summary.length > 20;
  const hasSkills = resumeData.skills.length > 0;
  const hasLanguages = resumeData.languages.length > 0;
  const hasEducation = resumeData.education.length > 0;
  const hasExperience = resumeData.experience.length > 0;
  const hasProjects = resumeData.projects.length > 0;
  const hasCertifications = resumeData.certifications.length > 0;

  const completionItems = [
    {
      label: "Personal Information",
      status: hasPersonalInfo,
      required: true,
      count: hasPersonalInfo ? "Complete" : "Missing",
    },
    {
      label: "Professional Summary",
      status: hasSummary,
      required: false,
      count: hasSummary ? "Added" : "Not added",
    },
    {
      label: "Skills",
      status: hasSkills,
      required: true,
      count: `${resumeData.skills.length} skills`,
    },
    {
      label: "Languages",
      status: hasLanguages,
      required: false,
      count: `${resumeData.languages.length} languages`,
    },
    {
      label: "Education",
      status: hasEducation,
      required: true,
      count: `${resumeData.education.length} entries`,
    },
    {
      label: "Work Experience",
      status: hasExperience,
      required: true,
      count: `${resumeData.experience.length} entries`,
    },
    {
      label: "Projects",
      status: hasProjects,
      required: false,
      count: `${resumeData.projects.length} projects`,
    },
    {
      label: "Certifications",
      status: hasCertifications,
      required: false,
      count: `${resumeData.certifications.length} certifications`,
    },
  ];

  const requiredComplete = completionItems
    .filter((item) => item.required)
    .every((item) => item.status);

  const totalComplete = completionItems.filter((item) => item.status).length;
  const completionPercentage = Math.round(
    (totalComplete / completionItems.length) * 100
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Review Your Resume
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Check your resume for completeness before saving
        </p>
      </div>

      {/* Overall Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200">
            Overall Completion
          </h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Ready to Save Alert */}
      {requiredComplete ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-200">
              Ready to Save!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              All required sections are complete. You can now save your resume.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-200">
              Missing Required Information
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Please complete all required sections before saving.
            </p>
          </div>
        </div>
      )}

      {/* Completion Checklist */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Completion Checklist
        </h3>
        <div className="space-y-2">
          {completionItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {item.status ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.label}
                    {item.required && (
                      <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                        *Required
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.count}
                  </p>
                </div>
              </div>
              {item.status && (
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                  Complete
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview Notice */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">Tip:</strong> Check
          the preview on the right to see how your resume will look. You can
          make changes at any time by clicking the "Previous" button.
        </p>
      </div>
    </div>
  );
}
