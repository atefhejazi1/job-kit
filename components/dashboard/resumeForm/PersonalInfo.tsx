"use client";

import { ChangeEvent, useCallback } from "react";
import { useResume } from "@/contexts/ResumeContext";

export default function PersonalInfo() {
  const { resumeData, setResumeData } = useResume();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setResumeData((prev) => ({ ...prev, [name]: value }));
    },
    [setResumeData]
  );

  return (
    <div>
      <h2 className="mb-3 font-semibold text-xl dark:text-white">
        Personal Info
      </h2>
      <input
        key="name-input"
        name="name"
        value={resumeData.name}
        onChange={handleChange}
        placeholder="Full Name"
        // Dark mode styles for input
        className="block mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      <input
        key="email-input"
        name="email"
        value={resumeData.email}
        onChange={handleChange}
        placeholder="Email"
        // Dark mode styles for input
        className="block mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      <input
        key="phone-input"
        name="phone"
        value={resumeData.phone}
        onChange={handleChange}
        placeholder="Phone"
        // Dark mode styles for input
        className="block mb-2 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
      <textarea
        key="summary-input"
        name="summary"
        value={resumeData.summary}
        onChange={handleChange}
        placeholder="Professional summary..."
        rows={4} // Increased rows for better visual summary input
        // Dark mode styles for textarea
        className="block p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
      />
    </div>
  );
}