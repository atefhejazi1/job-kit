"use client";

import { Edit, Eye } from "lucide-react";

interface EditToggleButtonProps {
  isEditMode: boolean;
  onToggle: () => void;
  editText?: string;
  viewText?: string;
  className?: string;
}


// زر تبديل بين وضعي التعديل والمعاينة
export default function EditToggleButton({
  isEditMode,
  onToggle,
  editText = "Edit Resume",
  viewText = "View Mode",
  className = "",
}: EditToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        flex items-center gap-2
        ${
          isEditMode
            ? 'bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600' // Dark mode for View Mode button (currently showing View)
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90' // Dark mode for Edit Mode button (currently showing Edit)
        }
        text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 
        shadow-sm hover:shadow-md active:scale-95
        ${className}
      `}
    >
      {isEditMode ? (
        <>
          <Eye className="w-4 h-4" />
          <span>{viewText}</span>
        </>
      ) : (
        <>
          <Edit className="w-4 h-4" />
          <span>{editText}</span>
        </>
      )}
    </button>
  );
}