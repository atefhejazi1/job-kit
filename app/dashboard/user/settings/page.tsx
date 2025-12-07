"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";

export default function UserSettingsPage() {
  const { user, updateUser } = useAuth() as any;
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setResumeUrl(user.resumeUrl || "");
      setNotifications(user.notifications ?? true);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSubmitting(true);

      // Try to use context update first if provided
      if (typeof updateUser === "function") {
        await updateUser({ name: name.trim(), email: email.trim(), resumeUrl: resumeUrl || null, notifications });
        setSuccess("Settings updated successfully.");
        // refresh or redirect if needed
        setTimeout(() => router.refresh(), 900);
        return;
      }

      // Fallback: call API endpoint
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), resumeUrl, notifications }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update settings");

      setSuccess("Settings updated successfully.");
      setTimeout(() => router.refresh(), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={name || user?.name} size="lg" />
        <div>
          <h2 className="text-xl font-semibold">User Settings</h2>
          <p className="text-sm text-gray-500">Manage your profile and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 p-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 block w-full rounded-md border-gray-200 p-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CV Link (resumeUrl)</label>
          <input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://drive.google.com/..." className="mt-1 block w-full rounded-md border-gray-200 p-3" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
            <p className="text-xs text-gray-500">Receive email updates about new jobs and application status</p>
          </div>
          <div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="form-checkbox h-5 w-5" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button disabled={submitting} className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md font-semibold">
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
      </form>
    </div>
  );
}
