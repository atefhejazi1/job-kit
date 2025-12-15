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

    // Get recent jobs with application count
    const jobs = await prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { applications: true },
        },
      },
    });

    // Format the response
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      applicationsCount: job._count.applications,
      postedDate: new Date(job.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: job.isActive ? ("active" as const) : ("closed" as const),
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("Error fetching recent jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent jobs" },
      { status: 500 }
    );
  }
}
