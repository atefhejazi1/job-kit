"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createApiHeadersWithoutContentType } from '@/lib/api-utils';
import { useSocket } from './useSocket';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const socket = useSocket();
  const fetchingRef = useRef(false);

  // Fetch initial unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user || fetchingRef.current) return;

    fetchingRef.current = true;
    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch('/api/messages', { headers });
      
      if (response.ok) {
        const threads = await response.json();
        
        // Count threads where the last message is not from current user and not read
        const totalUnread = threads.filter((thread: any) => {
          const lastMessage = thread.messages?.[0];
          // If there's a last message and it's not from current user
          return lastMessage && lastMessage.senderId !== user.id && !lastMessage.isRead;
        }).length;
        
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      fetchingRef.current = false;
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch only once on mount
      fetchUnreadCount();

      // Listen for new messages via socket
      if (socket) {
        const handleNewMessage = (data: any) => {
          // Only increment if the message is not from the current user
          if (data.senderId !== user.id) {
            setUnreadCount(prev => prev + 1);
          }
        };

        const handleMessageRead = () => {
          // Refresh count when messages are marked as read
          fetchUnreadCount();
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('messageRead', handleMessageRead);

        return () => {
          socket.off('newMessage', handleNewMessage);
          socket.off('messageRead', handleMessageRead);
        };
      }
    }
  }, [isAuthenticated, user?.id, socket, fetchUnreadCount]);

  const markAsRead = useCallback((threadId: string) => {
    // This can be called when user opens a thread
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const resetCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return {
    unreadCount,
    fetchUnreadCount,
    markAsRead,
    resetCount
  };
};
