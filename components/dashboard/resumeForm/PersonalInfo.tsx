"use client";

import { ChangeEvent, useCallback } from "react";
import { useResume } from "@/contexts/ResumeContext";

export default function PersonalInfo() {
  const { resumeData, setResumeData } = useResume();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setResumeData(prev => ({ ...prev, [name]: value }));
    },
    [setResumeData]
  );

  return (
    <div>
      <h2 className="mb-3 font-semibold text-xl">Personal Info</h2>
      <input
      key="name-input"
        name="name"
        value={resumeData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="block mb-2 p-2 border rounded w-full"
      />
      <input
      key="email-input"
        name="email"
        value={resumeData.email}
        onChange={handleChange}
        placeholder="Email"
        className="block mb-2 p-2 border rounded w-full"
      />
      <input
      key="phone-input"
        name="phone"
        value={resumeData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="block mb-2 p-2 border rounded w-full"
      />
      <textarea
      key="summary-input"
        name="summary"
        value={resumeData.summary}
        onChange={handleChange}
        placeholder="Professional summary..."
        className="block p-2 border rounded w-full h-24"
      />
    </div>
  );
}
