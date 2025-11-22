import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Get active jobs count
    const activeJobs = await prisma.job.count({
      where: {
        companyId: companyId,
        isActive: true,
      },
    });

    // Get total applications count (placeholder for now)
    // Note: This would need a JobApplication model in the future
    const totalApplications = 0;

    // Get interviews scheduled (placeholder for now)
    // Note: This would need an Interview model in the future
    const interviewsScheduled = 0;

    // Get hired this month (placeholder for now)
    // Note: This would need a hiring status in JobApplication model
    const hiredThisMonth = 0;

    return NextResponse.json({
      activeJobs,
      totalApplications,
      interviewsScheduled,
      hiredThisMonth,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}