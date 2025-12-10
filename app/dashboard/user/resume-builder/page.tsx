"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ResumeForm from "@/components/dashboard/resumeForm/ResumeForm";
import ResumePreview from "@/components/dashboard/ResumePreview";
import Button from "@/components/ui/Button";
import { useResume } from "@/contexts/ResumeContext";
import toast from "react-hot-toast";

export default function ResumeBuilderPage() {
  const { saveResume, loading, loadResume } = useResume();
  const router = useRouter();

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  return (
    <div
      // Dark mode for the main page background
      className="gap-6 grid grid-cols-1 md:grid-cols-2 p-6 min-h-screen dark:bg-gray-900"
    >
      <div
        // Dark mode for the form container
        className="bg-white shadow p-6 rounded-xl dark:bg-gray-800 dark:shadow-xl"
      >
        <ResumeForm />
      </div>

      <div
        // Dark mode for the preview container background
        className="bg-gray-100 shadow p-6 rounded-xl overflow-y-auto dark:bg-gray-700 dark:shadow-xl"
      >
        <ResumePreview />

        <div className="flex gap-2 mt-4">
          <button
            onClick={async () => {
              try {
                await saveResume();
                toast.success("Resume saved successfully");
                router.push("/dashboard/user");
              } catch (err) {
                toast.error("Failed to save resume");
              }
            }}
            disabled={loading}
            // Dark mode for Save button color
            className="bg-blue-600 disabled:opacity-50 px-4 py-2 rounded text-white dark:bg-primary dark:hover:bg-primary/90"
          >
            {loading ? "Saving..." : "Save Resume"}
          </button>

          {/* Assuming Button component handles dark mode internally for 'primary' variant */}
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