import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/interviews/[id] - Get interview details
export async function GET(
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
      include: {
        job: {
          include: {
            company: true,
          },
        },
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            jobSeeker: {
              select: {
                phone: true,
                linkedInProfile: true,
                currentPosition: true,
                experienceLevel: true,
                summary: true,
                skills: true,
              },
            },
          },
        },
        application: {
          select: {
            id: true,
            status: true,
            coverLetter: true,
            createdAt: true,
          },
        },
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this interview
    if (interview.candidateId !== user.id && interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this interview" },
        { status: 403 }
      );
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview" },
      { status: 500 }
    );
  }
}

// PUT /api/interviews/[id] - Update interview
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const companyId = req.headers.get("x-company-id");
    
    if (!userId || !companyId) {
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

    // Only company can update interview details (except candidate notes)
    if (user.userType !== "COMPANY" || interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "Only the company can update interview details" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      interviewType,
      scheduledAt,
      duration,
      meetingLink,
      meetingPassword,
      location,
      companyNotes,
    } = body;

    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        title,
        description,
        interviewType,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        meetingLink,
        meetingPassword,
        location,
        companyNotes,
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
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 }
    );
  }
}

// DELETE /api/interviews/[id] - Cancel/delete interview
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");
    const companyId = req.headers.get("x-company-id");
    
    if (!userId || !companyId) {
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

    // Only company can delete interviews
    if (user.userType !== "COMPANY" || interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "Only the company can cancel interviews" },
        { status: 403 }
      );
    }

    await prisma.interview.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Interview cancelled successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Failed to cancel interview" },
      { status: 500 }
    );
  }
}
