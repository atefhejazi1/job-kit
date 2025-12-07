import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createApiHeaders } from "@/lib/api-utils";

// Get message stats for dashboard
export async function GET(request: NextRequest) {
  try {
    const headers = createApiHeaders();
    const userId = request.headers.get("x-user-id");
    const companyId = request.headers.get("x-company-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Get thread statistics
    const totalThreads = await prisma.messageThread.count({
      where: {
        OR: [
          { companyId: companyId || userId },
          { applicantId: userId }
        ]
      }
    });

    const unreadCount = await prisma.messageThread.count({
      where: {
        OR: [
          { companyId: companyId || userId },
          { applicantId: userId }
        ],
        isRead: false
      }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayMessages = await prisma.message.count({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        createdAt: {
          gte: todayStart
        }
      }
    });

    const stats = {
      totalThreads,
      unreadCount,
      todayMessages
    };

    return NextResponse.json(stats, { headers });
  } catch (error) {
    console.error("Error fetching message stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch message statistics" },
      { status: 500 }
    );
  }
}
