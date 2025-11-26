// src/app/dashboard/user/resume-builder/page.tsx
"use client";

import ResumeForm from "@/components/dashboard/resumeForm/ResumeForm";
import ResumePreview from "@/components/dashboard/ResumePreview";
import Button from "@/components/ui/Button";
import { useResume } from "@/contexts/ResumeContext";

export default function ResumeBuilderPage() {
    const { saveResume, loading } = useResume();

    return (
        <div className="min-h-screen p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
                <ResumeForm />
            </div>

            <div className="bg-gray-100 p-6 rounded-xl shadow overflow-y-auto">
                <ResumePreview />

                {/* Save Button */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={saveResume}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Resume"}
                    </button>
                    <Button
                        variant="primary"
                        onClick={() => window.print()}
                        className="px-4 py-2"
                    >
                        Download PDF
                    </Button>
                </div>

            </div>
        </div>
    );
}