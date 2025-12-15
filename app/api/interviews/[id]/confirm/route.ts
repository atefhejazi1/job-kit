import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/interviews/[id]/confirm - Confirm interview attendance
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

    // Only candidate can confirm
    if (interview.candidateId !== user.id) {
      return NextResponse.json(
        { error: "Only the candidate can confirm the interview" },
        { status: 403 }
      );
    }

    // Can only confirm if status is SCHEDULED
    if (interview.status !== "SCHEDULED") {
      return NextResponse.json(
        { error: "Interview is not in scheduled state" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { candidateNotes } = body;

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        status: "CONFIRMED",
        candidateNotes,
      },
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
    console.error("Error confirming interview:", error);
    return NextResponse.json(
      { error: "Failed to confirm interview" },
      { status: 500 }
    );
  }
}
