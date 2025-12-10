"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/ui/Avatar";
import { useRouter } from "next/navigation";
import {
  createApiHeaders,
  createApiHeadersWithoutContentType,
} from "@/lib/api-utils";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

export default function UserSettingsPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [linkedInProfile, setLinkedInProfile] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarUrl(user.avatarUrl || "");
      // Load job seeker data if exists
      loadJobSeekerData();
    }
  }, [user]);

  const loadJobSeekerData = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        headers: createApiHeaders(user),
      });

      if (response.ok) {
        const data = await response.json();
        const jobSeeker = data.user?.jobSeeker;
        if (jobSeeker) {
          setPhone(jobSeeker.phone || "");
          setCurrentPosition(jobSeeker.currentPosition || "");
          setCity(jobSeeker.city || "");
          setCountry(jobSeeker.country || "");
          setLinkedInProfile(jobSeeker.linkedInProfile || "");
          setPortfolioUrl(jobSeeker.portfolioUrl || "");
          setSummary(jobSeeker.summary || "");
        }
      }
    } catch (error) {
      console.error("Error loading job seeker data:", error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        headers: {
          "x-user-id": user?.id || "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const uploadedUrl = data.files?.[0]?.url;

      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl);

        // Update user avatar in database
        const updateResponse = await fetch(`/api/users/${user?.id}`, {
          method: "PATCH",
          headers: createApiHeaders(user),
          body: JSON.stringify({
            avatarUrl: uploadedUrl,
          }),
        });

        if (updateResponse.ok) {
          const updatedData = await updateResponse.json();
          if (setUser && updatedData.user) {
            const updatedUser = { ...user, avatarUrl: uploadedUrl };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
          toast.success("Profile picture updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: createApiHeaders(user),
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          avatarUrl: avatarUrl || null,
          phone: phone.trim() || null,
          currentPosition: currentPosition.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
          linkedInProfile: linkedInProfile.trim() || null,
          portfolioUrl: portfolioUrl.trim() || null,
          summary: summary.trim() || null,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update settings");
      }

      // Update user in context
      if (setUser && data.user) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      toast.success("Settings updated successfully!");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update settings"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="bg-orange-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your profile and preferences
              </p>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Profile Picture
            </label>

            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingAvatar ? "Uploading..." : "Upload Picture"}
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      disabled={uploadingAvatar}
                      className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 400x400px. Max size: 5MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Position
                  </label>
                  <input
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Links
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    value={linkedInProfile}
                    onChange={(e) => setLinkedInProfile(e.target.value)}
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio URL
                  </label>
                  <input
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    type="url"
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Summary
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About You
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={5}
                  placeholder="Write a brief summary about your professional background and goals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
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