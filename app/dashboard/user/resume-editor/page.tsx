"use client";

import { useEffect, useState } from "react";
import { useResume } from "@/contexts/ResumeContext";
import ResumePreview from "@/components/dashboard/ResumePreview";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteCVButton from "./DeleteCVButton";
import EditToggleButton from "./EditToggleButton";

export default function ResumeEditorPage() {
  const { loadResume, loading } = useResume();
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(true);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-linear-to-br from-gray-50 to-gray-100 min-h-screen dark:bg-gray-900 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white shadow-md p-6 rounded-xl dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="border-4 border-primary border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Loading resume...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 py-8 min-h-screen dark:bg-gray-900 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-8">
          <div className="bg-white shadow-sm p-4 border border-gray-200 rounded-2xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-xl">
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-all duration-200 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <div>
                  <h1 className="font-bold text-gray-900 text-2xl dark:text-white">
                    Resume Editor
                  </h1>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
                    View and Edit your professional Resume
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <EditToggleButton
                  isEditMode={isEditMode}
                  onToggle={() => setIsEditMode(!isEditMode)}
                  editText="Edit Resume"
                  viewText="View Mode"
                />

                <DeleteCVButton />

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-primary hover:bg-orange-700 shadow-sm hover:shadow-md px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 dark:bg-primary dark:hover:bg-primary/90"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="mb-8">
          <ResumePreview
            mode={isEditMode ? "editable" : "readonly"}
            autoSave={isEditMode}
            className="shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}