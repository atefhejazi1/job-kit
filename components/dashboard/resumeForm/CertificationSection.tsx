"use client";

import { useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import { generateId } from "@/contexts/ResumeContext";
import { CertificationItem } from "@/types/resume.data.types";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { Award, Calendar, Key, ExternalLink, FileText, Plus, UploadCloud } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);

  // Common input styles for reusability
  const inputClasses =
    "px-3 py-2 border border-gray-300 rounded-lg focus:border-transparent focus:ring-2 focus:ring-orange-500/50 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-primary/50";
  const labelClasses = "block mb-1 text-gray-500 text-xs dark:text-gray-400";

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max size 10MB");

    setUploading(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return toast.error("User not logged in");
      const { id: userId } = JSON.parse(userData);

      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload/certifications", {
        method: "POST",
        headers: { "x-user-id": userId },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const uploaded = data.files?.[0];
      if (uploaded) {
        setCertification((c) => ({
          ...c,
          fileUrl: uploaded.url,
          fileName: uploaded.name,
        }));
        toast.success("File uploaded successfully");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    if (!certification.name.trim() || !certification.issuer.trim()) {
      toast.error("Name & Issuer are required");
      return;
    }
    setResumeData({ ...resumeData, certifications: [...resumeData.certifications, certification] });
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
    <div
      // Dark mode styles for container
      className="space-y-4 bg-white shadow-sm p-5 border border-gray-200 rounded-xl
      dark:bg-gray-800 dark:shadow-md dark:border-gray-700"
    >
      <div className="flex items-center gap-2">
        {/* Dark mode icon color */}
        <Award className="w-5 h-5 text-orange-600 dark:text-primary" />
        {/* Dark mode header text color */}
        <h2 className="font-semibold text-gray-800 text-lg dark:text-white">
          Certificates
        </h2>
      </div>

      <input
        value={certification.name}
        onChange={(e) => setCertification({ ...certification, name: e.target.value })}
        placeholder="Certification Name *"
        className={inputClasses}
      />
      <input
        value={certification.issuer}
        onChange={(e) => setCertification({ ...certification, issuer: e.target.value })}
        placeholder="Issuer *"
        className={inputClasses}
      />

      <div className="flex gap-3">
        <div className="flex-1">
          {/* Dark mode label text color */}
          <label className={labelClasses}>Issue Date</label>
          <input
            type="month"
            value={certification.issueDate}
            onChange={(e) => setCertification({ ...certification, issueDate: e.target.value })}
            className={inputClasses}
          />
        </div>
        <div className="flex-1">
          {/* Dark mode label text color */}
          <label className={labelClasses}>Credential ID</label>
          <input
            value={certification.credentialId}
            onChange={(e) => setCertification({ ...certification, credentialId: e.target.value })}
            placeholder="Optional"
            className={inputClasses}
          />
        </div>
      </div>

      <input
        value={certification.credentialUrl}
        onChange={(e) => setCertification({ ...certification, credentialUrl: e.target.value })}
        placeholder="Credential URL (optional)"
        className={inputClasses}
      />

      {/* Dark mode styles for file upload area */}
      <label
        className="flex justify-center items-center gap-2 p-4 border-2 border-gray-300 hover:border-orange-400 border-dashed rounded-lg transition cursor-pointer
        dark:border-gray-600 dark:hover:border-primary/80 dark:bg-gray-700"
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        {uploading ? (
          <UploadCloud className="w-5 h-5 text-orange-600 animate-spin dark:text-primary" />
        ) : certification.fileName ? (
          <>
            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {certification.fileName}
            </span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              Upload file (max 10MB)
            </span>
          </>
        )}
      </label>

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