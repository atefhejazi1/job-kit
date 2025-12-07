import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Safe JSON parsing helper
function safeJsonParse(value: string | null | undefined): string[] {
  if (!value) return [];
  
  // Ensure value is a string
  const stringValue = String(value);
  
  try {
    const parsed = JSON.parse(stringValue);
    return Array.isArray(parsed) ? parsed : [stringValue];
  } catch {
    // If not valid JSON, treat as comma-separated string
    return stringValue.split(',').map(item => item.trim()).filter(Boolean);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            location: true,
            industry: true,
            description: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields safely
    const jobData = {
      ...job,
      skills: safeJsonParse(job.skills as string | null),
      requirements: safeJsonParse(job.requirements as string | null),
      benefits: safeJsonParse(job.benefits as string | null),
    };

    return NextResponse.json(jobData);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}