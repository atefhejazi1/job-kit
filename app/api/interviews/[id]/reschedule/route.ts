import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificationService } from "@/lib/notifications";

// POST /api/interviews/[id]/reschedule - Request interview reschedule
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const interview = await prisma.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Both candidate and company can reschedule
    if (interview.candidateId !== user.id && interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this interview" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { scheduledAt, reason } = body;

    // Company must provide new time, candidate can just request reschedule
    if (user.userType === "COMPANY" && !scheduledAt) {
      return NextResponse.json(
        { error: "New scheduled time is required" },
        { status: 400 }
      );
    }

    // Update notes based on who is rescheduling
    const updateData: any = {
      status: "RESCHEDULED",
    };
    
    // Only update scheduledAt if provided (company rescheduling)
    if (scheduledAt) {
      updateData.scheduledAt = new Date(scheduledAt);
    }

    if (user.userType === "COMPANY") {
      updateData.companyNotes = reason
        ? `${interview.companyNotes || ""}\n\nRescheduled: ${reason}`
        : interview.companyNotes;
    } else {
      updateData.candidateNotes = reason
        ? `${interview.candidateNotes || ""}\n\nReschedule requested: ${reason}`
        : interview.candidateNotes;
    }

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: updateData,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                companyName: true,
                logo: true,
              },
            },
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Send notification to the other party
    const recipientUserId = user.userType === "COMPANY" 
      ? interview.candidateId 
      : interview.companyId;
    
    await notificationService.notifyInterviewRescheduled({
      recipientUserId,
      jobTitle: updatedInterview.job.title,
      newScheduledAt: scheduledAt ? new Date(scheduledAt) : interview.scheduledAt,
      previousScheduledAt: interview.scheduledAt,
      interviewId: interview.id,
      applicationId: interview.applicationId,
      jobId: interview.jobId,
      reason,
      isCandidate: user.userType !== "COMPANY"
    });

    return NextResponse.json({ interview: updatedInterview });
  } catch (error) {
    console.error("Error rescheduling interview:", error);
    return NextResponse.json(
      { error: "Failed to reschedule interview" },
      { status: 500 }
    );
  }
}
