"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import { Notification, NotificationsResponse } from "@/types/notification.types";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket.type";

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  // Actions
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (pageNum: number = 1) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/notifications?page=${pageNum}&limit=20`,
        { headers: createApiHeadersWithoutContentType(user) }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data: NotificationsResponse = await response.json();

      if (pageNum === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...data.notifications]);
      }

      setUnreadCount(data.unreadCount);
      setHasMore(data.pagination.page < data.pagination.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (hasMore && !loading) {
      await fetchNotifications(page + 1);
    }
  }, [fetchNotifications, hasMore, loading, page]);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: createApiHeadersWithoutContentType(user),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: createApiHeadersWithoutContentType(user),
      });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, [user]);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      const notification = notifications.find((n) => n.id === notificationId);
      
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: createApiHeadersWithoutContentType(user),
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  }, [user, notifications]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
        headers: createApiHeadersWithoutContentType(user),
      });

      if (!response.ok) {
        throw new Error("Failed to clear notifications");
      }

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  }, [user]);

  // Initialize socket connection and fetch initial notifications
  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    fetchNotifications(1);

    // Initialize socket connection
    socketRef.current = io(
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_APP_URL || ""
        : "http://localhost:3000",
      {
        path: "/api/socket",
        addTrailingSlash: false,
      }
    );

    // Join user's room for notifications
    socketRef.current.emit("join-user", user.id);

    // Listen for new notifications
    socketRef.current.on("new-notification", ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for notification count updates
    socketRef.current.on("notification-count-update", ({ unreadCount: count }) => {
      setUnreadCount(count);
    });

    // Listen for notification marked as read
    socketRef.current.on("notification-marked-read", ({ notificationId }) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
    });

    // Listen for all notifications read
    socketRef.current.on("all-notifications-read", () => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    loadMore,
  };
};
