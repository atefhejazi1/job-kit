"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { ResumeData } from "@/types/resume.data.types";
import toast from "react-hot-toast";

export default function GeneratePage() {
  const [form, setForm] = useState({
    company: "",
    position: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    // Fetch latest resume from database
    const res = await fetch("/api/resume/latest");
    const data = await res.json();

    const resume: ResumeData | null = data.resume;

    console.log("Latest Resume From DB:", resume);

    if (!resume) {
      toast.error("No CV available, please add one");
      setLoading(false);
      return;
    }

    // Send to generation API
    const generateRes = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        resumeData: resume,
      }),
    });

    const resultJson = await generateRes.json();
    setResult(resultJson.letter);

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Dark mode header text color */}
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Generate Cover Letter
      </h1>

      {/* Company */}
      <div className="mb-4">
        {/* Dark mode label text color */}
        <label className="block font-semibold dark:text-gray-200">
          Company
        </label>
        <input
          type="text"
          // Dark mode input background and text color
          className="w-full bg-gray-100 p-2 rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      {/* Position */}
      <div className="mb-4">
        {/* Dark mode label text color */}
        <label className="block font-semibold dark:text-gray-200">
          Position
        </label>
        <input
          type="text"
          // Dark mode input background and text color
          className="w-full bg-gray-100 p-2 rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </div>

      {/* Assuming Button component handles 'secondary' dark mode styles internally */}
      <Button variant="secondary" onClick={handleSubmit}>
        {loading ? "Generating..." : "Generate"}
      </Button>

      {result && (
        <div
          // Dark mode background for result box
          className="mt-6 bg-white shadow p-4 rounded dark:bg-gray-800 dark:shadow-lg"
        >
          {/* Dark mode header text color */}
          <h2 className="text-xl font-bold mb-2 dark:text-white">
            Generated Cover Letter:
          </h2>
          {/* Dark mode result text color */}
          <pre className="whitespace-pre-wrap dark:text-gray-300">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}