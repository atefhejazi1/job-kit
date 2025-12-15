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

    // Get company from database
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Get total jobs
    const totalJobs = await prisma.job.count({
      where: { companyId },
    });

    // Get open jobs
    const openJobs = await prisma.job.count({
      where: {
        companyId,
        isActive: true,
      },
    });

    // Get closed jobs
    const closedJobs = totalJobs - openJobs;

    // Get applications this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekApplications = await prisma.jobApplication.count({
      where: {
        job: { companyId },
        createdAt: { gte: oneWeekAgo },
      },
    });

    // Get total applications
    const totalApplications = await prisma.jobApplication.count({
      where: {
        job: { companyId },
      },
    });

    // Get interviews scheduled (applications with SHORTLISTED status)
    const interviewsScheduled = await prisma.jobApplication.count({
      where: {
        job: { companyId },
        status: "SHORTLISTED",
      },
    });

    // Get hired this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const hiredThisMonth = await prisma.jobApplication.count({
      where: {
        job: { companyId },
        status: "ACCEPTED",
        updatedAt: { gte: firstDayOfMonth },
      },
    });

    return NextResponse.json({
      totalJobs,
      openJobs,
      closedJobs,
      thisWeekApplications,
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