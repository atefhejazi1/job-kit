"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import toast from "react-hot-toast";
import { TeamMember } from "@/types/team.types";
import {
  Users,
  Mail,
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react";

const roleColors = {
  ADMIN: "bg-red-100 text-red-800",
  HR: "bg-blue-100 text-blue-800",
  RECRUITER: "bg-green-100 text-green-800",
  VIEWER: "bg-gray-100 text-gray-800",
};

const roleLabels = {
  ADMIN: "Admin",
  HR: "HR Manager",
  RECRUITER: "Recruiter",
  VIEWER: "Viewer",
};

const statusLabels = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

function TeamManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<
    "ADMIN" | "HR" | "RECRUITER" | "VIEWER"
  >("RECRUITER");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (user?.userType === "COMPANY") {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch("/api/dashboard/company/team", { headers });

      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      } else {
        toast.error("Failed to load team members");
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("An error occurred while loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setInviting(true);

    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch("/api/dashboard/company/team", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (response.ok) {
        toast.success("Invitation sent successfully");
        setInviteEmail("");
        setInviteRole("RECRUITER");
        setShowInviteForm(false);
        fetchTeamMembers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("An error occurred while sending the invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) {
      return;
    }

    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch(`/api/dashboard/company/team/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        toast.success("Team member removed successfully");
        fetchTeamMembers();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("An error occurred while removing the member");
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and permissions
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Invite Team Member
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invite Team Member
          </h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="RECRUITER">Recruiter</option>
                <option value="HR">HR Manager</option>
                <option value="ADMIN">Admin</option>
                <option value="VIEWER">Viewer - View Only</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={inviting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {inviting ? "Sending..." : "Send Invitation"}
              </button>
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Team Members ({teamMembers.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : teamMembers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No team members yet</p>
            <button
              onClick={() => setShowInviteForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Start by inviting a team member →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Email & Role */}
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {member.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.name || "Not set"}
                        </p>
                      </div>
                    </div>

                    {/* Status & Role */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {member.status === "PENDING" ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          <Clock className="w-3 h-3" />
                          {statusLabels[member.status]}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          {statusLabels[member.status]}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          roleColors[member.role]
                        }`}
                      >
                        {roleLabels[member.role]}
                      </span>
                    </div>

                    {/* Permissions */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        {member.canCreateJobs && "✓ Create jobs"}
                        {member.canEditJobs && " • ✓ Edit jobs"}
                        {member.canReviewApps && " • ✓ Review applications"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/company/team-settings/${member.id}`
                        )
                      }
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-blue-900">Role Permissions:</h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>
            <strong>Admin:</strong> Full permissions - create, edit, delete jobs
            and manage team
          </li>
          <li>
            <strong>HR Manager:</strong> Create and edit jobs, review
            applications
          </li>
          <li>
            <strong>Recruiter:</strong> Create and edit jobs, review
            applications
          </li>
          <li>
            <strong>Viewer:</strong> View only - no edit permissions
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function TeamManagementPage() {
  return (
    <ProtectedRoute requiredUserType="COMPANY">
      <TeamManagement />
    </ProtectedRoute>
  );
}
