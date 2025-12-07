import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiHeaders } from "@/lib/api-utils";
import { notificationService } from "@/lib/notifications";

// GET /api/messages - Get all message threads for the user
export async function GET(request: NextRequest) {
  try {
    const headers = createApiHeaders();
    const userId = request.headers.get("x-user-id");
    const companyId = request.headers.get("x-company-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Get threads where user is either company or applicant
    // Note: companyId in MessageThread refers to the User ID, not the Company record ID
    const threads = await prisma.messageThread.findMany({
      where: {
        OR: [
          { companyId: userId }, // Company user's threads
          { applicantId: userId } // User's threads
        ]
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        applicant: {
          select: {
            id: true,
            name: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(threads, { headers });
  } catch (error) {
    console.error("Error fetching message threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch message threads" },
      { status: 500 }
    );
  }
}

// POST /api/messages - Create a new message or thread
export async function POST(request: NextRequest) {
  try {
    const headers = createApiHeaders();
    const userId = request.headers.get("x-user-id");
    const companyId = request.headers.get("x-company-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content, threadId, jobId, attachments, messageType } = body;

    if (!receiverId || (!content && !attachments?.length)) {
      return NextResponse.json(
        { error: "Receiver ID and content or attachments are required" },
        { status: 400 }
      );
    }

    let thread;
    
    if (threadId) {
      // Use existing thread
      thread = await prisma.messageThread.findUnique({
        where: { id: threadId }
      });
      
      if (!thread) {
        return NextResponse.json({ error: "Thread not found" }, { status: 404 });
      }
    } else {
      // Create new thread or find existing one
      const existingThread = await prisma.messageThread.findFirst({
        where: {
          OR: [
            {
              companyId: companyId || userId,
              applicantId: receiverId,
              jobId: jobId || null
            },
            {
              companyId: receiverId,
              applicantId: userId,
              jobId: jobId || null
            }
          ]
        }
      });

      if (existingThread) {
        thread = existingThread;
      } else {
        thread = await prisma.messageThread.create({
          data: {
            companyId: companyId || userId,
            applicantId: receiverId,
            jobId: jobId || null,
            lastMessage: content,
            lastMessageAt: new Date(),
          }
        });
      }
    }

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
        threadId: thread.id,
        senderId: userId,
        receiverId,
        content: content || '',
        attachments: attachments || [],
        messageType: finalMessageType
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    // Update thread with last message info
    const lastMessage = content || (attachments?.length ? 
      `📎 ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}` : '');
    
    await prisma.messageThread.update({
      where: { id: thread.id },
      data: {
        lastMessage,
        lastMessageAt: new Date(),
        isRead: false
      }
    });

    // Send notification to receiver
    // Get job info if exists
    let jobTitle;
    if (thread.jobId) {
      const job = await prisma.job.findUnique({
        where: { id: thread.jobId },
        select: { title: true }
      });
      jobTitle = job?.title;
    }

    await notificationService.notifyNewMessage({
      recipientUserId: receiverId,
      senderName: message.sender.name,
      senderId: userId,
      messagePreview: lastMessage,
      threadId: thread.id,
      messageId: message.id,
      jobId: thread.jobId || undefined,
      jobTitle: jobTitle
    });

    return NextResponse.json(message, { headers, status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}