"use client";

import { TEMPLATES, TemplateType } from "@/types/resume.template.types";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Choose Your Template
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Select a design that best represents your professional style
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(TEMPLATES).map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? "border-blue-600 dark:border-primary bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }
              `}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-600 dark:bg-primary text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Template Preview */}
              <div
                className="w-full h-32 rounded mb-3 flex items-center justify-center"
                style={{ backgroundColor: template.colors.primary }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-1">
                    {template.name.charAt(0)}
                  </div>
                  <div className="text-xs opacity-75">Preview</div>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {template.description}
                </p>

                {/* Color Palette */}
                <div className="flex gap-1 mb-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.colors.primary }}
                    title="Primary Color"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.colors.secondary }}
                    title="Secondary Color"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.colors.accent }}
                    title="Accent Color"
                  />
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 2).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
