export interface MessageThread {
  id: string;
  companyId: string;
  applicantId: string;
  jobId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  company?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  applicant?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  job?: {
    id: string;
    title: string;
  };
  messages?: Message[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  messageType?: 'text' | 'image' | 'document' | 'mixed';
  isRead: boolean;
  createdAt: string;
  
  // Relations
  sender?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  receiver?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface MessageAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
  public_id?: string;
}

export interface CreateMessageRequest {
  receiverId: string;
  content: string;
  threadId?: string;
}

export interface MessageStats {
  totalThreads: number;
  unreadCount: number;
  todayMessages: number;
}
