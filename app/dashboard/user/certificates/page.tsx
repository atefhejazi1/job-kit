"use client";

import CertificationList from "@/components/dashboard/resumeForm/CertificationList ";
import CertificationSection from "@/components/dashboard/resumeForm/CertificationSection";
import { useResume } from "@/contexts/ResumeContext";

export default function CertificatesPage() {
  const { resumeData } = useResume();

  return (
    <div className="mx-auto px-4 py-8 max-w-4xl container">
      <h1 className="mb-8 font-bold text-3xl">My Certifications</h1>
      <CertificationSection />
      <div className="mt-8">
        <CertificationList certifications={resumeData.certifications} />
      </div>
    </div>
  );
}