import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id");
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "5");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Get recent applications for this company's jobs
    const applications = await prisma.jobApplication.findMany({
      where: {
        job: { companyId },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        job: {
          select: { title: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Format the response
    const formattedApplications = applications.map((app) => ({
      id: app.id,
      applicantName: app.user?.name || 'Unknown Applicant',
      position: app.job.title,
      appliedDate: new Date(app.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: app.status,
    }));

    return NextResponse.json(formattedApplications);
  } catch (error) {
    console.error("Error fetching recent applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent applications" },
      { status: 500 }
    );
  }
}
