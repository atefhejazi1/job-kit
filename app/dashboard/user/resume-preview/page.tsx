// app/dashboard/user/resume-preview/page.tsx
"use client";

import { useEffect } from "react";
import { useResume } from "@/contexts/ResumeContext";
import ResumePreview from "@/components/dashboard/ResumePreview";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResumePreviewPage() {
  const { loadResume, loading } = useResume();
  const router = useRouter();

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="border-orange-600 border-b-4 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-md mb-6 p-4 rounded-xl">
          <button
            onClick={() => router.push("/dashboard/user/resume-builder")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 cursor-pointer" /> Back to Edit
          </button>
          <h1 className="font-bold text-2xl">Resume Preview</h1>
          <Button variant="primary" onClick={() => window.print()}>
            Download PDF
          </Button>
        </div>

        {/* Resume Preview */}
        <ResumePreview />
      </div>
    </div>
  );
}
