import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/interviews/[id]/cancel - Cancel interview
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

    // Both candidate and company can cancel
    if (interview.candidateId !== user.id && interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this interview" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { reason } = body;

    // Update notes based on who is cancelling
    const updateData: any = {
      status: "CANCELLED",
    };

    if (user.userType === "COMPANY") {
      updateData.companyNotes = reason
        ? `${interview.companyNotes || ""}\n\nCancelled: ${reason}`
        : interview.companyNotes;
    } else {
      updateData.candidateNotes = reason
        ? `${interview.candidateNotes || ""}\n\nCancelled: ${reason}`
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

    return NextResponse.json({ interview: updatedInterview });
  } catch (error) {
    console.error("Error cancelling interview:", error);
    return NextResponse.json(
      { error: "Failed to cancel interview" },
      { status: 500 }
    );
  }
}
