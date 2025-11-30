export interface TeamMember {
  id: string;
  companyId: string;
  email: string;
  name?: string;
  role: "ADMIN" | "HR" | "RECRUITER" | "VIEWER";
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  invitedAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Permissions
  canCreateJobs: boolean;
  canEditJobs: boolean;
  canDeleteJobs: boolean;
  canReviewApps: boolean;
  canEditCompany: boolean;
  canManageTeam: boolean;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: "ADMIN" | "HR" | "RECRUITER" | "VIEWER";
}

export interface UpdateTeamMemberRequest {
  role?: "ADMIN" | "HR" | "RECRUITER" | "VIEWER";
  canCreateJobs?: boolean;
  canEditJobs?: boolean;
  canDeleteJobs?: boolean;
  canReviewApps?: boolean;
  canEditCompany?: boolean;
  canManageTeam?: boolean;
}

// Role-based default permissions
export const rolePermissions = {
  ADMIN: {
    canCreateJobs: true,
    canEditJobs: true,
    canDeleteJobs: true,
    canReviewApps: true,
    canEditCompany: true,
    canManageTeam: true,
  },
  HR: {
    canCreateJobs: true,
    canEditJobs: true,
    canDeleteJobs: false,
    canReviewApps: true,
    canEditCompany: false,
    canManageTeam: false,
  },
  RECRUITER: {
    canCreateJobs: true,
    canEditJobs: true,
    canDeleteJobs: false,
    canReviewApps: true,
    canEditCompany: false,
    canManageTeam: false,
  },
  VIEWER: {
    canCreateJobs: false,
    canEditJobs: false,
    canDeleteJobs: false,
    canReviewApps: false,
    canEditCompany: false,
    canManageTeam: false,
  },
};
