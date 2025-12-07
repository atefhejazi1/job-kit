import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Server } from "socket.io";

// Get messages for a specific thread
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { threadId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Verify user has access to this thread
    const thread = await prisma.messageThread.findFirst({
      where: {
        id: threadId,
        OR: [
          { companyId: userId },
          { applicantId: userId }
        ]
      }
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found or access denied" }, { status: 404 });
    }

    // Get messages with pagination
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: { threadId },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit
    });

    // Mark messages as read for the current user
    await prisma.message.updateMany({
      where: {
        threadId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    // Update thread read status
    await prisma.messageThread.update({
      where: { id: threadId },
      data: { isRead: true }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// Send a new message in thread
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    const { threadId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Verify user has access to this thread
    const thread = await prisma.messageThread.findFirst({
      where: {
        id: threadId,
        OR: [
          { companyId: userId },
          { applicantId: userId }
        ]
      }
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found or access denied" }, { status: 404 });
    }

    const body = await request.json();
    const { content, attachments, messageType } = body;

    if (!content?.trim() && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: "Message content or attachments required" }, { status: 400 });
    }

    // Determine receiver (the other person in the thread)
    const receiverId = thread.companyId === userId ? thread.applicantId : thread.companyId;

    // Determine message type
    let finalMessageType = messageType || 'text';
    if (attachments?.length) {
      const hasImages = attachments.some((url: string) => url.match(/\.(jpg|jpeg|png|gif)$/i));
      const hasDocs = attachments.some((url: string) => url.match(/\.(pdf|doc|docx|txt)$/i));
      
      if (hasImages && hasDocs) finalMessageType = 'mixed';
      else if (hasImages) finalMessageType = 'image';
      else if (hasDocs) finalMessageType = 'document';
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        threadId,
        senderId: userId,
        receiverId,
        content: content?.trim() || '',
        attachments: attachments || [],
        messageType: finalMessageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Update thread with last message info
    const lastMessage = content?.trim() || (attachments?.length ? 
      `📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}` : '');

    await prisma.messageThread.update({
      where: { id: threadId },
      data: {
        lastMessage,
        lastMessageAt: new Date(),
        isRead: false
      }
    });

    // Emit socket event for real-time updates
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/socket`);
      if (global.io) {
        // Emit to thread room
        global.io.to(`thread:${threadId}`).emit('new-message', {
          threadId,
          message: {
            id: message.id,
            content: message.content,
            attachments: message.attachments,
            messageType: message.messageType,
            senderId: message.senderId,
            receiverId: message.receiverId,
            createdAt: message.createdAt.toISOString(),
            sender: message.sender
          }
        });

        // Emit to receiver's personal room
        global.io.to(`user:${receiverId}`).emit('thread-updated', {
          threadId,
          lastMessage,
          lastMessageAt: new Date().toISOString()
        });
      }
    } catch (socketError) {
      console.log('Socket not available for real-time update');
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
