import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all saved jobs for the user or check if a specific job is saved
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    // If checking for a specific job
    if (jobId) {
      const savedJob = await prisma.savedJob.findUnique({
        where: {
          userId_jobId: {
            userId,
            jobId,
          },
        },
      });

      return NextResponse.json({
        jobs: savedJob ? [{ jobId }] : [],
      });
    }

    // Get all saved jobs with pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [savedJobs, total] = await Promise.all([
      prisma.savedJob.findMany({
        where: { userId },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              description: true,
              location: true,
              workType: true,
              salaryMin: true,
              salaryMax: true,
              currency: true,
              company: {
                select: {
                  id: true,
                  companyName: true,
                  logo: true,
                  location: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.savedJob.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      jobs: savedJobs,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }
}

// POST - Save a job
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Job already saved" },
        { status: 400 }
      );
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            workType: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
            company: {
              select: {
                id: true,
                companyName: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    console.log(`✅ Job saved by user ${userId}: ${job.title}`);

    return NextResponse.json(
      { 
        message: "Job saved successfully", 
        savedJob,
        jobTitle: job.title 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json(
      { error: "Failed to save job" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a saved job
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (!savedJob) {
      return NextResponse.json(
        { error: "Saved job not found" },
        { status: 404 }
      );
    }

    await prisma.savedJob.delete({
      where: { id: savedJob.id },
    });

    return NextResponse.json({ message: "Job removed from saved" });
  } catch (error) {
    console.error("Error removing saved job:", error);
    return NextResponse.json(
      { error: "Failed to remove saved job" },
      { status: 500 }
    );
  }
}
