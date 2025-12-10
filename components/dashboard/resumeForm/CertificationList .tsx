"use client";

import { CertificationItem } from "@/types/resume.data.types";
import { useResume } from "@/contexts/ResumeContext";
import { toast } from "react-hot-toast";
import { Award, Trash2, ExternalLink, Calendar, Key } from "lucide-react";

interface CertificationListProps {
  certifications: CertificationItem[];
}

export default function CertificationList({
  certifications,
}: CertificationListProps) {
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
      <div className="bg-gray-50 py-8 border border-gray-300 border-dashed rounded-lg text-gray-500 text-center">
        <Award className="mx-auto mb-3 w-10 h-10 text-gray-400" />
        <p className="text-lg">No certificates added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {certifications.map((cert, index) => (
        <div
          key={cert.id}
          className="group bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-xl transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Award className="mt-1 w-5 h-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                <p className="text-gray-600 text-sm">Issuer: {cert.issuer}</p>
                <div className="space-y-1 mt-2 text-gray-600 text-sm">
                  {cert.issueDate && (
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(cert.issueDate + "-01").toLocaleDateString(
                        undefined,
                        { month: "short", year: "numeric" }
                      )}
                    </p>
                  )}
                  {cert.credentialId && (
                    <p className="flex items-center gap-1">
                      <Key className="w-4 h-4 text-gray-500" />
                      {cert.credentialId}
                    </p>
                  )}
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 mt-2 text-blue-600 text-sm hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" /> Verify
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteCertification(index)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 transition-opacity cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
