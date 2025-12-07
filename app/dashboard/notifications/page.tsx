"use client";

import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationList from "@/components/notifications/NotificationList";

export default function NotificationsPage() {
  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-8">
        <NotificationList />
      </div>
    </NotificationProvider>
  );
}
