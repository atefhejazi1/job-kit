"use client";

import { useEffect, useState } from "react";
// Utility: Convert lab()/lch() colors to rgb/hex in a DOM subtree
function convertUnsupportedColorsToRGB(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const el = walker.currentNode as HTMLElement;
    const style = getComputedStyle(el);
    [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
    ].forEach((prop) => {
      let val = style.getPropertyValue(prop);
      // If value is a CSS variable, resolve it
      if (val && val.startsWith("var(")) {
        // Try to resolve the variable
        const match = val.match(/var\((--[\w-]+)\)/);
        if (match) {
          const varName = match[1];
          val = style.getPropertyValue(varName) || val;
        }
      }
      if (val && /lab\(|lch\(/i.test(val)) {
        // Create a temp element to resolve the color
        const temp = document.createElement("div");
        temp.style.color = val;
        document.body.appendChild(temp);
        const resolved = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        el.style.setProperty(prop, resolved, "important");
      }
    });
  }
}
import MultiStepResumeForm from "@/components/dashboard/resumeForm/MultiStepResumeForm";
import ResumePreviewWithTemplate from "@/components/dashboard/ResumePreviewWithTemplate";
import TemplateSelector from "@/components/dashboard/resumeForm/TemplateSelector";
import Button from "@/components/ui/Button";
import { useResume } from "@/contexts/ResumeContext";
import { Palette, Download, FileText } from "lucide-react";
import toast from "react-hot-toast";

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
    const loadingToast = toast.loading("Generating PDF...");
    try {
      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = document.querySelector(".resume-preview");
      if (!element) {
        toast.error("Resume preview not found. Please refresh and try again.", {
          id: loadingToast,
        });
        return;
      }

      // Convert lab/lch colors to rgb/hex before capture
      convertUnsupportedColorsToRGB(element as HTMLElement);

      // Check if element has content
      if (!element.innerHTML || element.innerHTML.trim() === "") {
        toast.error("Resume content is empty. Please add content first.", {
          id: loadingToast,
        });
        return;
      }

      // Direct capture without cloning first
      const canvas = await html2canvas(element as HTMLElement, {
        // scale: 1,
        useCORS: true,
        allowTaint: true,
        // backgroundColor: "#ffffff",
        logging: true,
        width: element.scrollWidth || element.clientWidth,
        height: element.scrollHeight || element.clientHeight,
        // x: 0,
        // y: 0,
        // scrollX: 0,
        // scrollY: 0,
      });

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas is empty - no content captured");
      }

      // Convert to PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      if (imgData === "data:,") {
        throw new Error("Canvas generated empty image data");
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgAspectRatio = canvas.height / canvas.width;
      // Calculate dimensions to fit page with margins
      const maxWidth = pdfWidth - 20;
      const maxHeight = pdfHeight - 20;
      let finalWidth = maxWidth;
      let finalHeight = maxWidth * imgAspectRatio;
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = maxHeight / imgAspectRatio;
      }
      const x = (pdfWidth - finalWidth) / 2;
      const y = 10;
      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
      // Save with clean filename
      const fileName = `${
        resumeData?.name
          ?.replace(/[^a-zA-Z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "_") || "resume"
      }.pdf`;
      pdf.save(fileName);
      toast.success("PDF generated successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Error generating PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`PDF generation failed: ${errorMessage}`, {
        id: loadingToast,
      });
      setTimeout(() => {
        setTimeout(() => {
          toast("Opening print dialog as fallback...", {
            icon: "ℹ️",
            style: { background: "#eff6ff", color: "#1d4ed8" },
          });
          window.print();
        }, 2000);
        window.print();
      }, 2000);
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
        <title>${resumeData?.name || "Resume"}</title>
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
    link.download = `${resumeData?.name || "resume"}.doc`;
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
                      <FileText className="w-4 h-4 text-white" />
                      {isGeneratingPDF ? "Generating..." : "Export as PDF"}
                    </button>
                    <button
                      onClick={exportAsWord}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-white"
                    >
                      <FileText className="w-4 h-4 text-white" />
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
