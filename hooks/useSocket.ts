"use client";

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket.type';

export const useSocket = (enabled: boolean = false) => {
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    // Only connect if explicitly enabled
    if (!enabled) {
      return;
    }

    // Initialize socket connection
    const socketInitializer = async () => {
      try {
        // Initialize socket connection
        socketRef.current = io(process.env.NODE_ENV === 'production' 
          ? (process.env.NEXT_PUBLIC_APP_URL || '')
          : 'http://localhost:3000', {
          path: '/api/socket',
          addTrailingSlash: false,
          timeout: 5000,
          forceNew: true
        });

        // Connection handlers
        socketRef.current.on('connect', () => {
          console.log('Connected to Socket.IO server');
        });

        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from Socket.IO server');
        });

        socketRef.current.on('connect_error', (error) => {
          // Silently handle connection errors to prevent console spam
          console.warn('Socket connection unavailable');
        });
      } catch (error) {
        console.warn('Failed to initialize socket connection');
      }
    };

    socketInitializer();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [enabled]);

  return socketRef.current;
};