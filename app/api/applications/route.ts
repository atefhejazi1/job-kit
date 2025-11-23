import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all applications for a company
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = request.headers.get("x-company-id");
    
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const jobId = searchParams.get("jobId");

    const skip = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = {
      job: {
        companyId: companyId,
      },
    };

    // Filter by specific job if provided
    if (jobId) {
      whereConditions.jobId = jobId;
    }

    // Filter by status if provided
    if (status && status !== "ALL") {
      whereConditions.status = status;
    }

    // Search functionality
    if (search) {
      whereConditions.OR = [
        { applicantName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { job: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Get applications with pagination
    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where: whereConditions,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              workType: true,
              salaryMin: true,
              salaryMax: true,
              currency: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.jobApplication.count({ where: whereConditions }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      applications: applications || [],
      total: total || 0,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch applications",
        applications: [],
        total: 0,
        totalPages: 1,
        currentPage: 1,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new job application (for job seekers)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobId,
      applicantName,
      email,
      phone,
      resumeUrl,
      coverLetter,
      experience,
      expectedSalary,
      availableFrom,
    } = body;

    // Validate required fields
    if (!jobId || !applicantName || !email) {
      return NextResponse.json(
        { error: "Job ID, applicant name, and email are required" },
        { status: 400 }
      );
    }

    // Check if job exists and is active
    const job = await prisma.job.findFirst({
      where: { id: jobId, isActive: true },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or is no longer active" },
        { status: 404 }
      );
    }

    // Check if application already exists
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_email: {
          jobId,
          email,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 409 }
      );
    }

    // Create new application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        applicantName,
        email,
        phone,
        resumeUrl,
        coverLetter,
        experience,
        expectedSalary,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        status: "PENDING",
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}