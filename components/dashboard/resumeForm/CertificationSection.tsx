"use client";

import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { generateId } from "@/contexts/ResumeContext";
import { CertificationItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { Award, Plus } from "lucide-react";

export default function CertificationSection() {
  const { resumeData, setResumeData } = useResume();
  const [certification, setCertification] = useState<CertificationItem>({
    id: generateId(),
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    fileUrl: "",
    fileName: "",
  });

  const handleAdd = () => {
    if (!certification.name.trim() || !certification.issuer.trim()) {
      toast.error("Name & Issuer are required");
      return;
    }
    setResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, certification],
    });
    toast.success("Certificate added successfully");
    setCertification({
      id: generateId(),
      name: "",
      issuer: "",
      issueDate: "",
      credentialId: "",
      credentialUrl: "",
      fileUrl: "",
      fileName: "",
    });
  };

  return (
    <div className="space-y-4 bg-white shadow-sm p-5 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-orange-600" />
        <h2 className="font-semibold text-gray-800 text-lg">Certificates</h2>
      </div>

      <input
        value={certification.name}
        onChange={(e) =>
          setCertification({ ...certification, name: e.target.value })
        }
        placeholder="Certification Name *"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 w-full"
      />
      <input
        value={certification.issuer}
        onChange={(e) =>
          setCertification({ ...certification, issuer: e.target.value })
        }
        placeholder="Issuer *"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 w-full"
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block mb-1 text-gray-500 text-xs">Issue Date</label>
          <input
            type="month"
            value={certification.issueDate}
            onChange={(e) =>
              setCertification({ ...certification, issueDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 w-full"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-gray-500 text-xs">
            Credential ID
          </label>
          <input
            value={certification.credentialId}
            onChange={(e) =>
              setCertification({
                ...certification,
                credentialId: e.target.value,
              })
            }
            placeholder="Optional"
            className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 w-full"
          />
        </div>
      </div>

      <input
        value={certification.credentialUrl}
        onChange={(e) =>
          setCertification({ ...certification, credentialUrl: e.target.value })
        }
        placeholder="Credential URL (optional)"
        className="px-3 py-2 border border-gray-300 focus:border-transparent rounded-lg focus:ring-2 focus:ring-orange-500 w-full"
      />

      <Button
        variant="secondary"
        className="flex justify-center items-center gap-2 w-full"
        onClick={handleAdd}
      >
        <Plus className="w-4 h-4" /> Add Certificate
      </Button>
    </div>
  );
}
