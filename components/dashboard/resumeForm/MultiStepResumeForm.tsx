"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useResume } from "@/contexts/ResumeContext";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import StepIndicator, { type Step } from "./StepIndicator";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceEducationStep from "./steps/ExperienceEducationStep";
import SkillsLanguagesStep from "./steps/SkillsLanguagesStep";
import ProjectsCertificationsStep from "./steps/ProjectsCertificationsStep";
import ReviewStep from "./steps/ReviewStep";

const STEPS: Step[] = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic details",
  },
  {
    id: 2,
    title: "Experience & Education",
    description: "Work & studies",
  },
  {
    id: 3,
    title: "Skills & Languages",
    description: "Your abilities",
  },
  {
    id: 4,
    title: "Projects & Certifications",
    description: "Achievements",
  },
  {
    id: 5,
    title: "Review",
    description: "Final check",
  },
];

export default function MultiStepResumeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { resumeData, saveResume, loading } = useResume();
  const router = useRouter();

  // Validate step before proceeding
  const validateStep = useCallback(
    (step: number): { valid: boolean; message?: string } => {
      switch (step) {
        case 1: // Personal Info
          if (!resumeData.name || !resumeData.email || !resumeData.phone) {
            return {
              valid: false,
              message:
                "Please fill in all required fields (Name, Email, Phone)",
            };
          }
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(resumeData.email)) {
            return { valid: false, message: "Please enter a valid email" };
          }
          return { valid: true };

        case 2: // Experience & Education
          if (resumeData.experience.length === 0) {
            return {
              valid: false,
              message: "Please add at least one work experience",
            };
          }
          if (resumeData.education.length === 0) {
            return {
              valid: false,
              message: "Please add at least one education entry",
            };
          }
          return { valid: true };

        case 3: // Skills & Languages
          if (resumeData.skills.length === 0) {
            return { valid: false, message: "Please add at least one skill" };
          }
          return { valid: true };

        case 4: // Projects & Certifications (optional)
          return { valid: true };

        case 5: // Review
          return { valid: true };

        default:
          return { valid: true };
      }
    },
    [resumeData]
  );

  const handleNext = useCallback(() => {
    const validation = validateStep(currentStep);

    if (!validation.valid) {
      toast.error(validation.message || "Please complete this step");
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, validateStep, completedSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleSaveDraft = useCallback(async () => {
    try {
      await saveResume();
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft");
      console.error("Save error:", error);
    }
  }, [saveResume]);

  const handleComplete = useCallback(async () => {
    // Validate all required steps
    const allValid = [1, 2, 3].every((step) => validateStep(step).valid);

    if (!allValid) {
      toast.error("Please complete all required sections");
      return;
    }

    try {
      await saveResume();
      toast.success("Resume saved successfully!");
      router.push("/dashboard/user");
    } catch (error) {
      toast.error("Failed to save resume");
      console.error("Save error:", error);
    }
  }, [saveResume, router, validateStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <ExperienceEducationStep />;
      case 3:
        return <SkillsLanguagesStep />;
      case 4:
        return <ProjectsCertificationsStep />;
      case 5:
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <StepIndicator
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Step Content */}
      <div className="min-h-[500px]">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Draft"}
          </Button>
        </div>

        <div>
          {currentStep < STEPS.length ? (
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Complete & Save"}
            </Button>
          )}
        </div>
      </div>

      {/* Step Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Step {currentStep} of {STEPS.length}
      </div>
    </div>
  );
}
