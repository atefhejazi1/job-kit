"use client";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="top-4 right-4 z-[9999] fixed bg-gray-200 dark:bg-gray-700 shadow-lg hover:shadow-xl px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100 transition-all duration-300"
    >
      {theme === "light" ? " Light" : " Dark"}
    </button>
  );
}
