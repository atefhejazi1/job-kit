"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { ResumeData } from "@/types/resume.data.types";
import toast from "react-hot-toast";

export default function GeneratePage() {
  const [form, setForm] = useState({ company: "", position: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    const res = await fetch("/api/resume/latest");
    const data = await res.json();
    const resume: ResumeData | null = data.resume;

    if (!resume) {
      toast.error("No CV available, please add one");
      setLoading(false);
      return;
    }

    const generateRes = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, resumeData: resume }),
    });

    const resultJson = await generateRes.json();

    if (!generateRes.ok || resultJson.error) {
      toast.error(resultJson.error || "Failed to generate cover letter");
      setLoading(false);
      return;
    }

    setResult(resultJson.letter);
    toast.success("Cover letter generated successfully!");
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Generate Cover Letter
      </h1>

      <div className="mb-4">
        <label className="block font-semibold dark:text-gray-200">Company</label>
        <input
          type="text"
          className="w-full bg-gray-100 p-2 rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold dark:text-gray-200">Position</label>
        <input
          type="text"
          className="w-full bg-gray-100 p-2 rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </div>

      <Button variant="secondary" onClick={handleSubmit}>
        {loading ? "Generating..." : "Generate"}
      </Button>

      {result && (
        <div className="mt-6 bg-white shadow p-4 rounded dark:bg-gray-800 dark:shadow-lg">
          <h2 className="text-xl font-bold mb-2 dark:text-white">
            Generated Cover Letter:
          </h2>
          <pre className="whitespace-pre-wrap dark:text-gray-300">{result}</pre>
        </div>
      )}
    </div>
  );
}
