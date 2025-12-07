import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/interviews/[id]/feedback - Add feedback after interview
export async function POST(
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

    if (!user || user.userType !== "COMPANY") {
      return NextResponse.json(
        { error: "Only companies can add feedback" },
        { status: 403 }
      );
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

    // Only company that conducted the interview can add feedback
    if (interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "You can only add feedback to your own interviews" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { feedback, rating, applicationStatus } = body;

    if (!feedback || !rating) {
      return NextResponse.json(
        { error: "Feedback and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Update interview with feedback
    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        feedback,
        rating: parseInt(rating),
        status: "COMPLETED",
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
        application: true,
      },
    });

    // Update application status if provided
    if (applicationStatus) {
      await prisma.jobApplication.update({
        where: { id: interview.applicationId },
        data: { status: applicationStatus },
      });
    }

    return NextResponse.json({ interview: updatedInterview });
  } catch (error) {
    console.error("Error adding feedback:", error);
    return NextResponse.json(
      { error: "Failed to add feedback" },
      { status: 500 }
    );
  }
}

// GET /api/interviews/[id]/feedback - Get feedback
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
      select: {
        id: true,
        feedback: true,
        rating: true,
        status: true,
        candidateId: true,
        companyId: true,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Verify user has access
    if (interview.candidateId !== user.id && interview.companyId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this interview" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      feedback: interview.feedback,
      rating: interview.rating,
      status: interview.status,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
