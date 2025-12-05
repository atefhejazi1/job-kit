"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function ApplyPage({ params }: Props) {
  const router = useRouter();
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastPayload, setLastPayload] = useState<any | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs?id=${params.id}`);
        if (!res.ok) throw new Error("Failed to load job");
        const data = await res.json();
        setJob(data.jobs?.[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});
    const form = e.currentTarget;
    // Robustly read input values (FormData may miss autofill in some browsers)
    const getVal = (name: string) => {
      const el = form.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) return (el.value ?? "").toString();
      const fd = new FormData(form);
      return (fd.get(name) as string) ?? "";
    };

    const applicantNameVal = getVal("applicantName").trim();
    const emailVal = getVal("email").trim();
    const payload: any = {
      jobId: getVal("jobId") || params.id,
      applicantName: applicantNameVal,
      email: emailVal,
      phone: getVal("phone") || undefined,
      resumeUrl: getVal("resumeUrl") || undefined,
      coverLetter: getVal("coverLetter") || undefined,
      experience: getVal("experience") || undefined,
      expectedSalary: (() => {
        const v = getVal("expectedSalary");
        return v ? Number(v) : undefined;
      })(),
      availableFrom: getVal("availableFrom") || undefined,
    };

    // keep last payload for UI debugging (helps inspect what's sent)
    setLastPayload(payload);
    // eslint-disable-next-line no-console
    console.debug("Application payload:", payload);

    // Client-side validation for required fields
    const missing: string[] = [];
    if (!payload.jobId) missing.push("jobId");
    if (!payload.applicantName || payload.applicantName.trim() === "") missing.push("applicantName");
    if (!payload.email || payload.email.trim() === "") missing.push("email");

    if (missing.length) {
      const nextErrors: Record<string, string> = {};
      missing.forEach((f) => {
        if (f === "jobId") nextErrors[f] = "Job ID is missing.";
        if (f === "applicantName") nextErrors[f] = "Please enter your full name.";
        if (f === "email") nextErrors[f] = "Please enter a valid email.";
      });
      setFieldErrors(nextErrors);
      setError("Please fill the required fields.");
      // expose payload for easier debugging in UI
      setSuccess(null);
      // eslint-disable-next-line no-console
      console.debug("Missing fields, payload was:", payload);
      // focus first missing field if present in form
      const first = missing[0];
      const el = form.querySelector(`[name=\"${first}\"]`) as HTMLElement | null;
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    // basic email format check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(payload.email)) {
      setFieldErrors({ email: "Please enter a valid email address." });
      setError("Please fix the highlighted fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to submit application");
        return;
      }

      setSuccess(data?.message || "Application submitted successfully");
      // navigate to user applications in dashboard after a short delay
      setTimeout(() => router.push(`/dashboard/user/applications`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Job not found</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 underline">Back to jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Apply for: {job.title}</h1>
          <p className="text-sm text-gray-600">{job.company?.companyName || job.location}</p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-lg">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap mt-2">{job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="jobId" value={params.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="applicantName"
              required
              onInput={(e) => {
                const name = (e.target as HTMLInputElement).name;
                setFieldErrors((prev) => {
                  if (!prev[name]) return prev;
                  const copy = { ...prev };
                  delete copy[name];
                  return copy;
                });
                setError(null);
              }}
              className={`mt-1 block w-full rounded-md p-3 border ${fieldErrors.applicantName ? "border-red-500" : "border-gray-200"}`}
            />
            {fieldErrors.applicantName && <p className="text-red-600 text-sm mt-1">{fieldErrors.applicantName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              onInput={(e) => {
                const name = (e.target as HTMLInputElement).name;
                setFieldErrors((prev) => {
                  if (!prev[name]) return prev;
                  const copy = { ...prev };
                  delete copy[name];
                  return copy;
                });
                setError(null);
              }}
              className={`mt-1 block w-full rounded-md p-3 border ${fieldErrors.email ? "border-red-500" : "border-gray-200"}`}
            />
            {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input name="phone" className="mt-1 block w-full rounded-md border-gray-200 p-3" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CV Link (resumeUrl)</label>
            <input name="resumeUrl" type="url" placeholder="https://drive.google.com/…" className="mt-1 block w-full rounded-md border-gray-200 p-3" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Letter (coverLetter)</label>
            <textarea name="coverLetter" rows={4} className="mt-1 block w-full rounded-md border-gray-200 p-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input name="experience" className="mt-1 block w-full rounded-md border-gray-200 p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Salary (expectedSalary)</label>
              <input name="expectedSalary" type="number" className="mt-1 block w-full rounded-md border-gray-200 p-3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available From (availableFrom)</label>
            <input name="availableFrom" type="date" className="mt-1 block w-full rounded-md border-gray-200 p-3" />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
            <Link href={`/jobs/${params.id}`} className="py-3 px-5 rounded-xl border border-gray-200 text-gray-700">Back</Link>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          {lastPayload && error && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Debug: built payload</p>
              <pre className="text-xs text-gray-700 overflow-auto max-h-40">{JSON.stringify(lastPayload, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
