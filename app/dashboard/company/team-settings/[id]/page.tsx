"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";
import { TeamMember, rolePermissions } from "@/types/team.types";
import { ArrowLeft, Save, Shield } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const permissionLabels = {
  canCreateJobs: "Create Jobs",
  canEditJobs: "Edit Jobs",
  canDeleteJobs: "Delete Jobs",
  canReviewApps: "Review Applications",
  canEditCompany: "Edit Company Profile",
  canManageTeam: "Manage Team",
};

function TeamMemberSettings({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const { user } = useAuth();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "HR" | "RECRUITER" | "VIEWER">(
    "VIEWER"
  );
  const [permissions, setPermissions] = useState({
    canCreateJobs: false,
    canEditJobs: false,
    canDeleteJobs: false,
    canReviewApps: false,
    canEditCompany: false,
    canManageTeam: false,
  });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (user?.userType === "COMPANY" && id) {
      fetchMemberDetails();
    }
  }, [user, id]);

  const fetchMemberDetails = async () => {
    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch("/api/dashboard/company/team", { headers });

      if (response.ok) {
        const members = await response.json();
        const found = members.find((m: TeamMember) => m.id === id);
        if (found) {
          setMember(found);
          setRole(found.role);
          setPermissions({
            canCreateJobs: found.canCreateJobs,
            canEditJobs: found.canEditJobs,
            canDeleteJobs: found.canDeleteJobs,
            canReviewApps: found.canReviewApps,
            canEditCompany: found.canEditCompany,
            canManageTeam: found.canManageTeam,
          });
        } else {
          toast.error("Member not found");
          router.back();
        }
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (newRole: string) => {
    const selectedRole = newRole as keyof typeof rolePermissions;
    setRole(selectedRole);

    // Apply default permissions for the role
    const defaultPerms =
      rolePermissions[selectedRole] || rolePermissions.VIEWER;
    setPermissions(defaultPerms);
  };

  const handlePermissionChange = (permission: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
  };

  const handleSave = async () => {
    if (!member) return;

    setSaving(true);

    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch(`/api/dashboard/company/team/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          role,
          ...permissions,
        }),
      });

      if (response.ok) {
        toast.success("Permissions saved successfully");
        router.push("/dashboard/company/team");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save permissions");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!member) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Permission Settings
          </h1>
          <p className="text-gray-600 mt-1">{member.email}</p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Role</h2>
        </div>

        <select
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ADMIN">Admin - Full Permissions</option>
          <option value="HR">HR Manager</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="VIEWER">Viewer - View Only</option>
        </select>

        <p className="text-sm text-gray-600 mt-3">
          Choose a role to set default permissions
        </p>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Detailed Permissions
        </h2>

        <div className="space-y-3">
          {Object.entries(permissions).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  handlePermissionChange(
                    key as keyof typeof permissions,
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-900">
                {permissionLabels[key as keyof typeof permissionLabels]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> You can customize permissions manually after
          selecting a role
        </p>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Permissions"}
        </button>
        <button
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function TeamMemberSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProtectedRoute requiredUserType="COMPANY">
      <TeamMemberSettings params={params} />
    </ProtectedRoute>
  );
}
