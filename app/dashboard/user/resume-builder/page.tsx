"use client";

import { useEffect, useState } from "react";
import MultiStepResumeForm from "@/components/dashboard/resumeForm/MultiStepResumeForm";
import ResumePreviewWithTemplate from "@/components/dashboard/ResumePreviewWithTemplate";
import TemplateSelector from "@/components/dashboard/resumeForm/TemplateSelector";
import Button from "@/components/ui/Button";
import { useResume } from "@/contexts/ResumeContext";
import { Palette, Download, FileText } from "lucide-react";

export default function ResumeBuilderPage() {
  const { loadResume, selectedTemplate, setSelectedTemplate, resumeData } =
    useResume();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.querySelector(".resume-preview");
      if (!element) {
        alert("Resume preview not found");
        return;
      }

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${resumeData?.personalInfo?.name || "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const exportAsWord = () => {
    // Simple HTML export that can be opened in Word
    const resumeContent = document.querySelector(".resume-preview")?.innerHTML;
    if (!resumeContent) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${resumeData?.personalInfo?.name || "Resume"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .resume-preview { max-width: 800px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="resume-preview">${resumeContent}</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resumeData?.personalInfo?.name || "resume"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create your professional resume in easy steps
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            <MultiStepResumeForm />
          </div>

          {/* Preview Section */}
          <div className="bg-gray-100 dark:bg-gray-700 shadow-lg rounded-xl p-6 sticky top-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Live Preview
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  className="text-sm flex items-center gap-2 text-white hover:text-gray-900"
                >
                  <Palette className="w-4 h-4" />
                  {showTemplateSelector ? "Hide" : "Templates"}
                </Button>

                <div className="relative group">
                  <Button
                    variant="outline"
                    className="text-sm flex items-center gap-2 text-white hover:text-gray-900"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={generatePDF}
                      disabled={isGeneratingPDF}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-white"
                    >
                      <FileText className="w-4 h-4 text-white"/>
                      {isGeneratingPDF ? "Generating..." : "Export as PDF"}
                    </button>
                    <button
                      onClick={exportAsWord}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-white"
                    >
                      <FileText className="w-4 h-4 text-white"/>
                      Export as Word
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Template Selector */}
            {showTemplateSelector && (
              <div className="mb-4">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={(template) => {
                    setSelectedTemplate(template);
                    setShowTemplateSelector(false);
                  }}
                />
              </div>
            )}

            {/* Resume Preview with Selected Template */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden resume-preview">
              <ResumePreviewWithTemplate />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
