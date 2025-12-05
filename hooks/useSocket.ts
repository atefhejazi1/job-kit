"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket.type';

export const useSocket = () => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInitializer = async () => {
      // Initialize socket connection
      socketRef.current = io(process.env.NODE_ENV === 'production' 
        ? (process.env.NEXT_PUBLIC_APP_URL || '')
        : 'http://localhost:3000', {
        path: '/api/socket',
        addTrailingSlash: false
      });

      // Connection handlers
      socketRef.current.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    };

    socketInitializer();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return socketRef.current;
};