"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createApiHeadersWithoutContentType } from "@/lib/api-utils";
import {
  MessageThread,
  Message,
  MessageStats,
  MessageAttachment,
} from "@/types/message.type";
import toast from "react-hot-toast";
import FileUpload from "@/components/ui/FileUpload";
import MessageAttachmentView from "@/components/ui/MessageAttachmentView";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  Paperclip,
} from "lucide-react";

export default function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [stats, setStats] = useState<MessageStats>({
    totalThreads: 0,
    unreadCount: 0,
    todayMessages: 0,
  });
  const [showMobileThreads, setShowMobileThreads] = useState(true);
  const [isRealtime, setIsRealtime] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<MessageAttachment[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom (only if user is near bottom)
  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;

    if (force) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      // Check if user is near bottom (within 100px)
      const container = messagesEndRef.current.parentElement;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;
        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  // Fetch message threads
  const fetchThreads = useCallback(async () => {
    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch("/api/messages", { headers });

      if (response.ok) {
        const data = await response.json();
        setThreads(data);
      } else {
        console.error("Failed to load conversations");
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  }, [user]);

  // Fetch message stats
  const fetchStats = async () => {
    try {
      const headers = createApiHeadersWithoutContentType(user);
      const response = await fetch("/api/messages/threads", { headers });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch messages for selected thread
  const fetchMessages = useCallback(
    async (threadId: string) => {
      try {
        const headers = createApiHeadersWithoutContentType(user);
        const response = await fetch(`/api/messages/${threadId}`, { headers });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Failed to load messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    [user]
  );

  // Send message
  const sendMessage = async () => {
    if (
      (!messageInput.trim() && !selectedFiles.length) ||
      !selectedThread ||
      sendingMessage
    )
      return;

    setSendingMessage(true);
    try {
      const headers = {
        ...createApiHeadersWithoutContentType(user),
        "Content-Type": "application/json",
      };

      const attachmentUrls = selectedFiles.map((file) => file.url);
      const messageData = {
        content: messageInput.trim(),
        attachments: attachmentUrls,
        messageType: selectedFiles.length > 0 ? "mixed" : "text",
      };

      const response = await fetch(`/api/messages/${selectedThread.id}`, {
        method: "POST",
        headers,
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");
        setSelectedFiles([]);
        setShowFileUpload(false);

        // Force scroll to bottom after sending message
        setTimeout(() => scrollToBottom(true), 100);

        // Update thread in the list
        const lastMessage =
          messageInput.trim() ||
          (selectedFiles.length > 0
            ? `📎 ${selectedFiles.length} attachment${
                selectedFiles.length > 1 ? "s" : ""
              }`
            : "");

        setThreads((prev) =>
          prev.map((thread) =>
            thread.id === selectedThread.id
              ? {
                  ...thread,
                  lastMessage,
                  lastMessageAt: new Date().toISOString(),
                }
              : thread
          )
        );
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle thread selection
  const selectThread = (thread: MessageThread) => {
    setSelectedThread(thread);
    setShowMobileThreads(false);
    fetchMessages(thread.id);
  };

  // Filter threads based on search
  const filteredThreads = threads.filter((thread) => {
    const otherUser =
      user?.id === thread.companyId ? thread.applicant : thread.company;
    const jobTitle = thread.job?.title || "";
    const searchText = `${otherUser?.name || ""} ${jobTitle}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when thread is selected (force scroll)
  useEffect(() => {
    if (selectedThread) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToBottom(true), 100);
    }
  }, [selectedThread]);

  // Real-time polling for threads
  useEffect(() => {
    if (user && isRealtime) {
      fetchThreads();
      fetchStats();

      // Poll threads every 5 seconds
      intervalRef.current = setInterval(() => {
        fetchThreads();
        fetchStats();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [user, isRealtime, fetchThreads]);

  // Real-time polling for messages in selected thread
  useEffect(() => {
    if (selectedThread && isRealtime) {
      // Poll messages every 3 seconds for selected thread
      messageIntervalRef.current = setInterval(() => {
        fetchMessages(selectedThread.id);
      }, 3000);

      return () => {
        if (messageIntervalRef.current) {
          clearInterval(messageIntervalRef.current);
        }
      };
    }
  }, [selectedThread, isRealtime, fetchMessages]);

  // Initial load
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchThreads(), fetchStats()]).finally(() =>
        setLoading(false)
      );
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-white rounded-lg shadow-sm border border-gray-200 flex">
      {/* Threads Sidebar */}
      <div
        className={`
        w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col
        ${!showMobileThreads ? "hidden md:flex" : "flex"}
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {stats.unreadCount} unread
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageCircle className="w-12 h-12 mb-3" />
              <p className="text-lg font-medium">No conversations yet</p>
              <p className="text-sm">Start messaging with job applicants</p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const otherUser =
                user?.id === thread.companyId
                  ? thread.applicant
                  : thread.company;
              const isSelected = selectedThread?.id === thread.id;

              return (
                <div
                  key={thread.id}
                  onClick={() => selectThread(thread)}
                  className={`
                    p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                    ${
                      isSelected
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {otherUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name and Job */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {otherUser?.name || "Unknown User"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {thread.lastMessageAt
                            ? new Date(thread.lastMessageAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            : new Date(thread.updatedAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                        </span>
                      </div>

                      {thread.job && (
                        <p className="text-sm text-blue-600 mb-1">
                          {thread.job.title}
                        </p>
                      )}

                      {/* Last Message */}
                      <p className="text-sm text-gray-600 truncate">
                        {thread.lastMessage || "No messages yet"}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!thread.isRead && (
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`
        flex-1 flex flex-col
        ${showMobileThreads ? "hidden md:flex" : "flex"}
      `}
      >
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileThreads(true)}
                    className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {(user?.id === selectedThread.companyId
                      ? selectedThread.applicant?.name
                      : selectedThread.company?.name
                    )
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {user?.id === selectedThread.companyId
                        ? selectedThread.applicant?.name
                        : selectedThread.company?.name || "Unknown User"}
                    </h2>
                    {selectedThread.job && (
                      <p className="text-sm text-blue-600">
                        {selectedThread.job.title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                    <p>No messages in this conversation</p>
                    <p className="text-sm">Send a message to get started</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isFromMe = message.senderId === user?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        isFromMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                        max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                        ${
                          isFromMe
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }
                      `}
                      >
                        {message.content && (
                          <p className="text-sm">{message.content}</p>
                        )}

                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <MessageAttachmentView
                              attachments={message.attachments}
                              messageType={message.messageType}
                            />
                          )}

                        <div
                          className={`
                          flex items-center justify-end gap-1 mt-1
                          ${isFromMe ? "text-blue-200" : "text-gray-500"}
                        `}
                        >
                          <span className="text-xs">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          {isFromMe && <CheckCircle className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* File Upload Section */}
              {showFileUpload && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <FileUpload onFilesSelected={setSelectedFiles} maxFiles={5} />
                </div>
              )}

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedFiles.length} file
                      {selectedFiles.length > 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="text-xs text-blue-700 truncate"
                      >
                        📎 {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach files"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={
                    (!messageInput.trim() && !selectedFiles.length) ||
                    sendingMessage
                  }
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors m-auto"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // No thread selected
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-600">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
