import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/interviews - Get all interviews for the current user
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    // Build filter based on user type
    const whereClause: any = {};

    if (user.userType === "COMPANY") {
      whereClause.companyId = user.id;
    } else {
      whereClause.candidateId = user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.interviewType = type;
    }

    const interviews = await prisma.interview.findMany({
      where: whereClause,
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
            avatarUrl: true,
          },
        },
        application: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}

// POST /api/interviews - Create a new interview
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const companyId = req.headers.get("x-company-id");
    
    if (!userId || !companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user || user.userType !== "COMPANY") {
      return NextResponse.json(
        { error: "Only companies can schedule interviews" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      applicationId,
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

    // Validate required fields
    if (
      !applicationId ||
      !title ||
      !interviewType ||
      !scheduledAt ||
      !duration
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get application details
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify company owns this job
    if (application.job.companyId !== user.company?.id) {
      return NextResponse.json(
        { error: "You can only schedule interviews for your own jobs" },
        { status: 403 }
      );
    }

    // Create interview
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        jobId: application.jobId,
        candidateId: application.userId,
        companyId: user.id,
        title,
        description,
        interviewType,
        scheduledAt: new Date(scheduledAt),
        duration: parseInt(duration),
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

    // Update application status to INTERVIEWING
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: "INTERVIEWING" },
    });

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
