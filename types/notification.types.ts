// Notification Types for Job-Kit Platform

export enum NotificationType {
  // Application related
  NEW_APPLICATION = "NEW_APPLICATION",           // Company receives new job application
  APPLICATION_VIEWED = "APPLICATION_VIEWED",     // Applicant notified their application was viewed
  APPLICATION_SHORTLISTED = "APPLICATION_SHORTLISTED", // Applicant shortlisted
  APPLICATION_ACCEPTED = "APPLICATION_ACCEPTED", // Applicant accepted
  APPLICATION_REJECTED = "APPLICATION_REJECTED", // Applicant rejected

  // Interview related
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",   // New interview scheduled
  INTERVIEW_CONFIRMED = "INTERVIEW_CONFIRMED",   // Interview confirmed
  INTERVIEW_RESCHEDULED = "INTERVIEW_RESCHEDULED", // Interview rescheduled
  INTERVIEW_CANCELLED = "INTERVIEW_CANCELLED",   // Interview cancelled
  INTERVIEW_REMINDER = "INTERVIEW_REMINDER",     // Reminder before interview
  INTERVIEW_COMPLETED = "INTERVIEW_COMPLETED",   // Interview completed
  INTERVIEW_FEEDBACK = "INTERVIEW_FEEDBACK",     // Feedback received

  // Message related
  NEW_MESSAGE = "NEW_MESSAGE",                   // New message received

  // Job related
  NEW_JOB_MATCH = "NEW_JOB_MATCH",               // Job matches user profile
  JOB_DEADLINE_REMINDER = "JOB_DEADLINE_REMINDER", // Job application deadline approaching

  // System
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",   // System-wide announcement
  ACCOUNT_UPDATE = "ACCOUNT_UPDATE",             // Account related updates
}

// Notification data payloads for different types
export interface ApplicationNotificationData {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  applicantName?: string;
  status?: string;
}

export interface InterviewNotificationData {
  interviewId: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName?: string;
  candidateName?: string;
  scheduledAt: string;
  interviewType: string;
  meetingLink?: string;
  location?: string;
  duration?: number;
  previousScheduledAt?: string; // For rescheduled interviews
  reason?: string; // For cancelled/rescheduled interviews
}

export interface MessageNotificationData {
  threadId: string;
  messageId: string;
  senderName: string;
  senderId: string;
  preview: string; // First 100 chars of message
  jobId?: string;
  jobTitle?: string;
}

export interface JobNotificationData {
  jobId: string;
  jobTitle: string;
  companyName: string;
  deadline?: string;
  matchScore?: number;
}

export interface SystemNotificationData {
  announcementId?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
}

// Union type for all notification data
export type NotificationData =
  | ApplicationNotificationData
  | InterviewNotificationData
  | MessageNotificationData
  | JobNotificationData
  | SystemNotificationData;

// Main Notification interface
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData | null;
  isRead: boolean;
  readAt?: Date | string | null;
  actionUrl?: string | null;
  createdAt: Date | string;
}

// API Response types
export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

export interface NotificationCountResponse {
  unreadCount: number;
}

// Create notification input
export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  actionUrl?: string;
}

// Bulk create for multiple users
export interface BulkCreateNotificationInput {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  actionUrl?: string;
}

// Notification preferences (for future use)
export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // Granular preferences
  applications: {
    newApplication: boolean;
    statusUpdate: boolean;
  };
  interviews: {
    scheduled: boolean;
    reminder: boolean;
    cancelled: boolean;
  };
  messages: {
    newMessage: boolean;
  };
  jobs: {
    newMatch: boolean;
    deadline: boolean;
  };
}

// Real-time notification event
export interface NotificationEvent {
  notification: Notification;
  timestamp: string;
}

// Helper type for notification icons
export const NotificationIcons: Record<NotificationType, string> = {
  [NotificationType.NEW_APPLICATION]: "📝",
  [NotificationType.APPLICATION_VIEWED]: "👁️",
  [NotificationType.APPLICATION_SHORTLISTED]: "⭐",
  [NotificationType.APPLICATION_ACCEPTED]: "✅",
  [NotificationType.APPLICATION_REJECTED]: "❌",
  [NotificationType.INTERVIEW_SCHEDULED]: "📅",
  [NotificationType.INTERVIEW_CONFIRMED]: "✔️",
  [NotificationType.INTERVIEW_RESCHEDULED]: "🔄",
  [NotificationType.INTERVIEW_CANCELLED]: "🚫",
  [NotificationType.INTERVIEW_REMINDER]: "⏰",
  [NotificationType.INTERVIEW_COMPLETED]: "🎉",
  [NotificationType.INTERVIEW_FEEDBACK]: "💬",
  [NotificationType.NEW_MESSAGE]: "💬",
  [NotificationType.NEW_JOB_MATCH]: "🎯",
  [NotificationType.JOB_DEADLINE_REMINDER]: "⚠️",
  [NotificationType.SYSTEM_ANNOUNCEMENT]: "📢",
  [NotificationType.ACCOUNT_UPDATE]: "👤",
};

// Helper type for notification colors
export const NotificationColors: Record<NotificationType, string> = {
  [NotificationType.NEW_APPLICATION]: "bg-blue-100 text-blue-800",
  [NotificationType.APPLICATION_VIEWED]: "bg-gray-100 text-gray-800",
  [NotificationType.APPLICATION_SHORTLISTED]: "bg-yellow-100 text-yellow-800",
  [NotificationType.APPLICATION_ACCEPTED]: "bg-green-100 text-green-800",
  [NotificationType.APPLICATION_REJECTED]: "bg-red-100 text-red-800",
  [NotificationType.INTERVIEW_SCHEDULED]: "bg-purple-100 text-purple-800",
  [NotificationType.INTERVIEW_CONFIRMED]: "bg-green-100 text-green-800",
  [NotificationType.INTERVIEW_RESCHEDULED]: "bg-orange-100 text-orange-800",
  [NotificationType.INTERVIEW_CANCELLED]: "bg-red-100 text-red-800",
  [NotificationType.INTERVIEW_REMINDER]: "bg-amber-100 text-amber-800",
  [NotificationType.INTERVIEW_COMPLETED]: "bg-green-100 text-green-800",
  [NotificationType.INTERVIEW_FEEDBACK]: "bg-indigo-100 text-indigo-800",
  [NotificationType.NEW_MESSAGE]: "bg-blue-100 text-blue-800",
  [NotificationType.NEW_JOB_MATCH]: "bg-emerald-100 text-emerald-800",
  [NotificationType.JOB_DEADLINE_REMINDER]: "bg-amber-100 text-amber-800",
  [NotificationType.SYSTEM_ANNOUNCEMENT]: "bg-gray-100 text-gray-800",
  [NotificationType.ACCOUNT_UPDATE]: "bg-slate-100 text-slate-800",
};
