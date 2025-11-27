"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeaders } from "@/lib/api-utils";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { Lock, Mail, Trash2, Check, X, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, login } = useAuth();
  const headers = createApiHeaders(user);

  const [editingField, setEditingField] = useState<null | "email" | "password">(
    null
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    currentPassword: "",
  });

  // Update formData when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validationSchemas = {
    email: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      currentPassword: Yup.string()
        .min(1, "Password is required")
        .required("Password is required"),
    }),
    password: Yup.object({
      newPassword: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("New password is required"),
      currentPassword: Yup.string()
        .min(1, "Current password is required")
        .required("Current password is required"),
    }),
  };

  const handleSave = async () => {
    if (!editingField) return;
    setLoading(true);

    try {
      await validationSchemas[editingField].validate(formData, {
        abortEarly: false,
      });
    } catch (err: any) {
      if (err.inner) {
        err.inner.forEach((e: any) => toast.error(e.message));
      } else {
        toast.error(err.message);
      }
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        currentPassword: formData.currentPassword,
        userId: user?.id,
      };

      if (editingField === "email") {
        payload.action = "change-email";
        payload.newEmail = formData.email;
      } else if (editingField === "password") {
        payload.action = "change-password";
        payload.newPassword = formData.newPassword;
      }

      const res = await fetch("/api/dashboard/account", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Updated successfully");

        if (editingField === "email" && user) {
          const updatedUser = { ...user, email: formData.email };
          login(updatedUser);
        }

        setEditingField(null);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      } else {
        toast.error(data.error || data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      email: user?.email || "",
    }));
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Enter your current password to delete account:");
    if (!password) return;

    if (!confirm("Are you sure? Your account will be permanently deleted"))
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/account/delete", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ currentPassword: password, userId: user?.id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Account deleted successfully");
        logout();
      } else {
        toast.error(data.error || data.message || "Account deletion failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account and security settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.userType === "COMPANY"
                    ? "Company Account"
                    : "Job Seeker Account"}
                </p>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Email
                  </p>
                  {editingField === "email" ? (
                    <div className="space-y-3">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="New email"
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={loading}
                      />
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Current password"
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  )}
                </div>
              </div>
              {editingField === "email" ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="p-2 text-gray-400 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingField("email")}
                  className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Password
                  </p>
                  {editingField === "password" ? (
                    <div className="space-y-3">
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Current password"
                        className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        disabled={loading}
                      />
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New password"
                        className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        disabled={loading}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">••••••••</p>
                  )}
                </div>
              </div>
              {editingField === "password" ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="p-2 text-gray-400 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingField("password")}
                  className="ml-4 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  Change
                </button>
              )}
            </div>
          </div>

          {/* Security Alert */}
          <div className="p-6 bg-blue-50 border-b border-blue-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Security Tip</p>
              <p className="text-sm text-blue-700 mt-1">
                Use a strong password with letters, numbers, and special
                characters
              </p>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="p-6 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Permanently delete your account from the system
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Account created on{" "}
            {new Date(user.createdAt || Date.now()).toLocaleDateString("en-US")}
          </p>
        </div>
      </div>
    </div>
  );
}
