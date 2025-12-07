import { prisma } from "@/lib/prisma";
import {
  NotificationType,
  CreateNotificationInput,
  BulkCreateNotificationInput,
  ApplicationNotificationData,
  InterviewNotificationData,
  MessageNotificationData,
} from "@/types/notification.types";

// Helper class for creating notifications
class NotificationService {
  // Create a single notification
  async create(input: CreateNotificationInput) {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data as any,
        actionUrl: input.actionUrl,
      },
    });

    // Emit socket event for real-time notification
    this.emitNotification(input.userId, notification);

    return notification;
  }

  // Create notifications for multiple users
  async createBulk(input: BulkCreateNotificationInput) {
    const notifications = await prisma.notification.createMany({
      data: input.userIds.map((userId) => ({
        userId,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data as any,
        actionUrl: input.actionUrl,
      })),
    });

    // Emit socket events
    for (const userId of input.userIds) {
      const unreadCount = await this.getUnreadCount(userId);
      this.emitCountUpdate(userId, unreadCount);
    }

    return notifications;
  }

  // Emit notification via socket
  private emitNotification(userId: string, notification: any) {
    if (global.io) {
      global.io.to(`user-${userId}`).emit("new-notification", { notification });
      this.updateCount(userId);
    }
  }

  // Update and emit unread count
  private async updateCount(userId: string) {
    const unreadCount = await this.getUnreadCount(userId);
    this.emitCountUpdate(userId, unreadCount);
  }

  // Emit count update
  private emitCountUpdate(userId: string, unreadCount: number) {
    if (global.io) {
      global.io.to(`user-${userId}`).emit("notification-count-update", { unreadCount });
    }
  }

  // Get unread count
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // ============= APPLICATION NOTIFICATIONS =============

  // Notify company about new application
  async notifyNewApplication(data: {
    companyUserId: string;
    applicantName: string;
    jobTitle: string;
    jobId: string;
    applicationId: string;
  }) {
    return this.create({
      userId: data.companyUserId,
      type: NotificationType.NEW_APPLICATION,
      title: "New Job Application",
      message: `${data.applicantName} applied for ${data.jobTitle}`,
      data: {
        applicationId: data.applicationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        applicantName: data.applicantName,
      } as ApplicationNotificationData,
      actionUrl: `/dashboard/company/applications/${data.applicationId}`,
    });
  }

  // Notify applicant about application status change
  async notifyApplicationStatusChange(data: {
    applicantUserId: string;
    status: string;
    jobTitle: string;
    companyName: string;
    jobId: string;
    applicationId: string;
  }) {
    const statusMessages: Record<string, { type: NotificationType; title: string; message: string }> = {
      REVIEWED: {
        type: NotificationType.APPLICATION_VIEWED,
        title: "Application Reviewed",
        message: `Your application for ${data.jobTitle} at ${data.companyName} has been reviewed`,
      },
      SHORTLISTED: {
        type: NotificationType.APPLICATION_SHORTLISTED,
        title: "You've Been Shortlisted! 🎉",
        message: `Congratulations! You've been shortlisted for ${data.jobTitle} at ${data.companyName}`,
      },
      ACCEPTED: {
        type: NotificationType.APPLICATION_ACCEPTED,
        title: "Application Accepted! 🎊",
        message: `Great news! Your application for ${data.jobTitle} at ${data.companyName} has been accepted`,
      },
      REJECTED: {
        type: NotificationType.APPLICATION_REJECTED,
        title: "Application Update",
        message: `Your application for ${data.jobTitle} at ${data.companyName} was not selected for this position`,
      },
    };

    const statusInfo = statusMessages[data.status];
    if (!statusInfo) return null;

    return this.create({
      userId: data.applicantUserId,
      type: statusInfo.type,
      title: statusInfo.title,
      message: statusInfo.message,
      data: {
        applicationId: data.applicationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        status: data.status,
      } as ApplicationNotificationData,
      actionUrl: `/dashboard/user/applications/${data.applicationId}`,
    });
  }

  // ============= INTERVIEW NOTIFICATIONS =============

  // Notify candidate about scheduled interview
  async notifyInterviewScheduled(data: {
    candidateUserId: string;
    jobTitle: string;
    companyName: string;
    scheduledAt: Date;
    interviewType: string;
    interviewId: string;
    applicationId: string;
    jobId: string;
    meetingLink?: string;
    location?: string;
  }) {
    const formattedDate = new Date(data.scheduledAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return this.create({
      userId: data.candidateUserId,
      type: NotificationType.INTERVIEW_SCHEDULED,
      title: "Interview Scheduled 📅",
      message: `Your interview for ${data.jobTitle} at ${data.companyName} is scheduled for ${formattedDate}`,
      data: {
        interviewId: data.interviewId,
        applicationId: data.applicationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        scheduledAt: data.scheduledAt.toISOString(),
        interviewType: data.interviewType,
        meetingLink: data.meetingLink,
        location: data.location,
      } as InterviewNotificationData,
      actionUrl: `/dashboard/user/interviews/${data.interviewId}`,
    });
  }

  // Notify about interview rescheduled
  async notifyInterviewRescheduled(data: {
    recipientUserId: string;
    jobTitle: string;
    newScheduledAt: Date;
    previousScheduledAt: Date;
    interviewId: string;
    applicationId: string;
    jobId: string;
    reason?: string;
    isCandidate: boolean;
  }) {
    const formattedDate = new Date(data.newScheduledAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return this.create({
      userId: data.recipientUserId,
      type: NotificationType.INTERVIEW_RESCHEDULED,
      title: "Interview Rescheduled 🔄",
      message: `Your interview for ${data.jobTitle} has been rescheduled to ${formattedDate}${data.reason ? `. Reason: ${data.reason}` : ""}`,
      data: {
        interviewId: data.interviewId,
        applicationId: data.applicationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        scheduledAt: data.newScheduledAt.toISOString(),
        previousScheduledAt: data.previousScheduledAt.toISOString(),
        reason: data.reason,
      } as InterviewNotificationData,
      actionUrl: data.isCandidate
        ? `/dashboard/user/interviews/${data.interviewId}`
        : `/dashboard/company/interviews/${data.interviewId}`,
    });
  }

  // Notify about interview cancelled
  async notifyInterviewCancelled(data: {
    recipientUserId: string;
    jobTitle: string;
    scheduledAt: Date;
    interviewId: string;
    applicationId: string;
    jobId: string;
    reason?: string;
    isCandidate: boolean;
  }) {
    return this.create({
      userId: data.recipientUserId,
      type: NotificationType.INTERVIEW_CANCELLED,
      title: "Interview Cancelled 🚫",
      message: `Your interview for ${data.jobTitle} has been cancelled${data.reason ? `. Reason: ${data.reason}` : ""}`,
      data: {
        interviewId: data.interviewId,
        applicationId: data.applicationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        scheduledAt: data.scheduledAt.toISOString(),
        reason: data.reason,
      } as InterviewNotificationData,
      actionUrl: data.isCandidate
        ? `/dashboard/user/interviews`
        : `/dashboard/company/interviews`,
    });
  }

  // Notify about interview reminder
  async notifyInterviewReminder(data: {
    userId: string;
    jobTitle: string;
    scheduledAt: Date;
    interviewId: string;
    applicationId: string;
    jobId: string;
    meetingLink?: string;
    location?: string;
    minutesBefore: number;
    isCandidate: boolean;
  }) {
    return this.create({
      userId: data.userId,
      type: NotificationType.INTERVIEW_REMINDER,
      title: `Interview in ${data.minutesBefore} minutes ⏰`,
      message: `Your interview for ${data.jobTitle} starts in ${data.minutesBefore} minutes`,
      data: {
        interviewId: data.interviewId,
        applicationId: data.applicationId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        scheduledAt: data.scheduledAt.toISOString(),
        meetingLink: data.meetingLink,
        location: data.location,
      } as InterviewNotificationData,
      actionUrl: data.isCandidate
        ? `/dashboard/user/interviews/${data.interviewId}`
        : `/dashboard/company/interviews/${data.interviewId}`,
    });
  }

  // ============= MESSAGE NOTIFICATIONS =============

  // Notify about new message
  async notifyNewMessage(data: {
    recipientUserId: string;
    senderName: string;
    senderId: string;
    messagePreview: string;
    threadId: string;
    messageId: string;
    jobId?: string;
    jobTitle?: string;
  }) {
    return this.create({
      userId: data.recipientUserId,
      type: NotificationType.NEW_MESSAGE,
      title: `New message from ${data.senderName}`,
      message: data.messagePreview.length > 100
        ? data.messagePreview.substring(0, 100) + "..."
        : data.messagePreview,
      data: {
        threadId: data.threadId,
        messageId: data.messageId,
        senderName: data.senderName,
        senderId: data.senderId,
        preview: data.messagePreview,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
      } as MessageNotificationData,
      actionUrl: `/dashboard/messages?thread=${data.threadId}`,
    });
  }

  // ============= SYSTEM NOTIFICATIONS =============

  // Send system announcement to all users
  async notifySystemAnnouncement(data: {
    title: string;
    message: string;
    userIds?: string[]; // If not provided, send to all users
    priority?: "low" | "medium" | "high";
  }) {
    let targetUserIds = data.userIds;

    if (!targetUserIds) {
      const users = await prisma.user.findMany({
        select: { id: true },
      });
      targetUserIds = users.map((u) => u.id);
    }

    return this.createBulk({
      userIds: targetUserIds,
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title: data.title,
      message: data.message,
      data: {
        priority: data.priority || "medium",
        category: "announcement",
      },
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

export default notificationService;
