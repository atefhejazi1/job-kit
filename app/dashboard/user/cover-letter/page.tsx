"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { ResumeData } from "@/types/resume.data.types";

export default function GeneratePage() {
  const [form, setForm] = useState({
    company: "",
    position: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    // ----- Fetch latest resume from database -----
    const res = await fetch("/api/resume/latest");
    const data = await res.json();

    const resume: ResumeData | null = data.resume;

    console.log("Latest Resume From DB:", resume);

    if (!resume) {
      alert("لا يوجد سيرة ذاتية في قاعدة البيانات!");
      setLoading(false);
      return;
    }

    // ----- Send to generation API -----
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
      <h1 className="text-3xl font-bold mb-6">Generate Cover Letter</h1>

      {/* Company */}
      <div className="mb-4">
        <label className="block font-semibold">Company</label>
        <input
          type="text"
          className="w-full bg-gray-100 p-2 rounded"
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      {/* Position */}
      <div className="mb-4">
        <label className="block font-semibold">Position</label>
        <input
          type="text"
          className="w-full bg-gray-100 p-2 rounded"
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </div>

      <Button variant="secondary" onClick={handleSubmit}>
        {loading ? "Generating..." : "Generate"}
      </Button>

      {result && (
        <div className="mt-6 bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Generated Cover Letter:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
