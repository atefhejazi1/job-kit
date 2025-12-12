"use client";

import { useResume } from "@/contexts/ResumeContext";
import ModernTemplate from "./resumeTemplates/ModernTemplate";
import ClassicTemplate from "./resumeTemplates/ClassicTemplate";
import MinimalTemplate from "./resumeTemplates/MinimalTemplate";
import CreativeTemplate from "./resumeTemplates/CreativeTemplate";

export default function ResumePreviewWithTemplate() {
  const { resumeData, selectedTemplate } = useResume();

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate data={resumeData} />;
      case "classic":
        return <ClassicTemplate data={resumeData} />;
      case "minimal":
        return <MinimalTemplate data={resumeData} />;
      case "creative":
        return <CreativeTemplate data={resumeData} />;
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  return <div className="w-full">{renderTemplate()}</div>;
}
