"use client";

import { useResume } from "@/contexts/ResumeContext";
import ModernTemplate from "./resumeTemplates/ModernTemplate";
import ClassicTemplate from "./resumeTemplates/ClassicTemplate";
import MinimalTemplate from "./resumeTemplates/MinimalTemplate";
import CreativeTemplate from "./resumeTemplates/CreativeTemplate";
import ExecutiveTemplate from "./resumeTemplates/ExecutiveTemplate";
import TechnicalTemplate from "./resumeTemplates/TechnicalTemplate";
import SimpleTemplate from "./resumeTemplates/SimpleTemplate";
import ProfessionalTemplate from "./resumeTemplates/ProfessionalTemplate";

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
      case "executive":
        return <ExecutiveTemplate data={resumeData} />;
      case "technical":
        return <TechnicalTemplate data={resumeData} />;
      case "simple":
        return <SimpleTemplate data={resumeData} />;
      case "professional":
        return <ProfessionalTemplate data={resumeData} />;
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  return <div className="w-full">{renderTemplate()}</div>;
}
