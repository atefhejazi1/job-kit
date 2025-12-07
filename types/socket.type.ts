import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Notification } from './notification.types';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface ClientToServerEvents {
  'join-user': (userId: string) => void;
  'join-thread': (threadId: string) => void;
  'leave-thread': (threadId: string) => void;
  'typing-start': (data: { threadId: string; userId: string; userName: string }) => void;
  'typing-stop': (data: { threadId: string; userId: string }) => void;
  // Notification events
  'notification-read': (data: { notificationId: string; userId: string }) => void;
  'notifications-read-all': (data: { userId: string }) => void;
}

export interface ServerToClientEvents {
  'new-message': (data: {
    threadId: string;
    message: {
      id: string;
      content: string;
      senderId: string;
      receiverId: string;
      createdAt: string;
      sender: {
        id: string;
        name: string;
      };
    };
  }) => void;
  'message-read': (data: { threadId: string; messageId: string; userId: string }) => void;
  'user-typing': (data: { userId: string; userName: string }) => void;
  'user-stopped-typing': (data: { userId: string }) => void;
  'thread-updated': (data: { threadId: string; lastMessage: string; lastMessageAt: string }) => void;
  
  // Notification events
  'new-notification': (data: { notification: Notification }) => void;
  'notification-count-update': (data: { unreadCount: number }) => void;
  'notification-marked-read': (data: { notificationId: string }) => void;
  'all-notifications-read': (data: { userId: string }) => void;
}