"use client";

import { CertificationItem } from "@/types/resume.data.types";
import { useResume } from "@/contexts/ResumeContext";
import { toast } from "react-hot-toast";
import { Award, Trash2, ExternalLink, Calendar, Key, FileText } from "lucide-react";

interface CertificationListProps {
  certifications: CertificationItem[];
}

export default function CertificationList({ certifications }: CertificationListProps) {
  const { resumeData, setResumeData } = useResume();

  const deleteCertification = (index: number) => {
    if (!confirm("Delete this certificate?")) return;
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter((_, i) => i !== index),
    });
    toast.success("Certificate deleted successfully");
  };

  if (!certifications?.length) {
    return (
      <div
        // Dark mode styles for empty state
        className="bg-gray-50 py-8 border border-gray-300 border-dashed rounded-lg text-gray-500 text-center
        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
      >
        {/* Dark mode icon color */}
        <Award className="mx-auto mb-3 w-10 h-10 text-gray-400 dark:text-gray-500" />
        <p className="text-lg">No certificates added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {certifications.map((cert, index) => (
        <div
          key={cert.id}
          // Dark mode styles for certificate item container
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow
          dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              {/* Dark mode for Award icon color */}
              <Award className="mt-1 w-5 h-5 text-orange-600 dark:text-primary" />
              <div>
                {/* Dark mode for title text color */}
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {cert.name}
                </h3>
                {/* Dark mode for issuer text color */}
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  Issuer: {cert.issuer}
                </p>
                <div className="space-y-1 mt-2 text-gray-600 text-sm dark:text-gray-300">
                  {cert.issueDate && (
                    <p className="flex items-center gap-1">
                      {/* Dark mode for Calendar icon color */}
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      {new Date(cert.issueDate + "-01").toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {cert.credentialId && (
                    <p className="flex items-center gap-1">
                      {/* Dark mode for Key icon color */}
                      <Key className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      {cert.credentialId}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Dark mode for Verify link color
                      className="flex items-center gap-1 text-blue-600 text-sm hover:underline dark:text-blue-400"
                    >
                      <ExternalLink className="w-4 h-4" /> Verify
                    </a>
                  )}
                  {cert.fileUrl && (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Dark mode for View Certificate link color
                      className="flex items-center gap-1 text-blue-600 text-sm hover:underline dark:text-blue-400"
                    >
                      <FileText className="w-4 h-4" /> View Certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteCertification(index)}
              // Dark mode for Trash icon color and hover state
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity cursor-pointer
              dark:text-red-500 dark:hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}