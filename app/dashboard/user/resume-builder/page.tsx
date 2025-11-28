// src/app/dashboard/user/resume-builder/page.tsx
"use client";
import { useEffect } from "react"; // 
import { useRouter } from "next/navigation";
import ResumeForm from "@/components/dashboard/resumeForm/ResumeForm";
import ResumePreview from "@/components/dashboard/ResumePreview";
import Button from "@/components/ui/Button";
import { useResume } from "@/contexts/ResumeContext";


export default function ResumeBuilderPage() {
    const { saveResume, loading, loadResume, resumeData } = useResume();
   const router = useRouter();

    useEffect(() => {
        loadResume();
    }, [loadResume]);

   return (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 p-6 min-h-screen">
            <div className="bg-white shadow p-6 rounded-xl">
               <ResumeForm key={JSON.stringify(resumeData)} />
            </div>

            <div className="bg-gray-100 shadow p-6 rounded-xl overflow-y-auto">
                <ResumePreview />

                {/* Save Button */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={async () => {
    await saveResume();
    router.push("/dashboard/user");
}}
                        disabled={loading}
                        className="bg-blue-600 disabled:opacity-50 px-4 py-2 rounded text-white"
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
