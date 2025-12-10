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
        await updateUser({
          name: name.trim(),
          email: email.trim(),
          resumeUrl: resumeUrl || null,
          notifications,
        });
        setSuccess("Settings updated successfully.");
        // refresh or redirect if needed
        setTimeout(() => router.refresh(), 900);
        return;
      }

      // Fallback: call API endpoint
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          resumeUrl,
          notifications,
        }),
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
    <div className="bg-white rounded-xl shadow p-6 dark:bg-slate-800 dark:shadow-xl dark:border dark:border-slate-700">
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={name || user?.name} size="lg" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            User Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-200 p-3 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>

        {/* CV Link Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
            CV Link (resumeUrl)
          </label>
          <input
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="mt-1 block w-full rounded-md border border-gray-200 p-3 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Email Notifications
            </label>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Receive email updates about new jobs and application status
            </p>
          </div>
          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded dark:bg-slate-700 dark:border-slate-600 dark:checked:bg-blue-600 dark:checked:border-transparent transition duration-150 ease-in-out"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            disabled={submitting}
            className={`
              py-2 px-6 rounded-md font-semibold transition-colors duration-200
              ${
                submitting
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed dark:bg-slate-600 dark:text-slate-400"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              }
            `}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-md dark:bg-red-900/40 dark:text-red-300">
            Error: {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 bg-green-50 p-3 rounded-md dark:bg-green-900/40 dark:text-green-300">
            Success: {success}
          </p>
        )}
      </form>
    </div>
  );
}