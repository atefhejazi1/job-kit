import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Search and filters
    const query = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const workType = searchParams.get("workType");
    const salaryMin = searchParams.get("salaryMin");
    const salaryMax = searchParams.get("salaryMax");
    const experienceLevel = searchParams.get("experienceLevel");
    const skills = searchParams.get("skills")
      ? searchParams.get("skills")!.split(",").map((s) => s.trim())
      : [];

    // Build filter conditions
    const where: any = {
      AND: [],
    };

    // Text search
    if (query) {
      where.AND.push({
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { company: { companyName: { contains: query, mode: "insensitive" } } },
        ],
      });
    }

    // Location filter
    if (location) {
      where.AND.push({
        location: { contains: location, mode: "insensitive" },
      });
    }

    // Work type filter
    if (workType) {
      where.AND.push({ workType });
    }

    // Salary range filter
    if (salaryMin || salaryMax) {
      const salaryFilter: any = {};
      if (salaryMin) {
        salaryFilter.gte = parseFloat(salaryMin);
      }
      if (salaryMax) {
        salaryFilter.lte = parseFloat(salaryMax);
      }
      where.AND.push({ salaryMax: salaryFilter });
    }

    // Experience level filter
    if (experienceLevel) {
      where.AND.push({ experienceLevel });
    }

    // Skills filter (if job has any of the requested skills)
    if (skills.length > 0) {
      where.AND.push({
        skills: {
          hasSome: skills,
        },
      });
    }

    // Clean up empty AND array
    if (where.AND.length === 0) {
      delete where.AND;
    }

    // Execute search
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
              logo: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      jobs,
      total,
      page,
      limit,
      totalPages,
      filters: {
        query,
        location,
        workType,
        salaryMin,
        salaryMax,
        experienceLevel,
        skills,
      },
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: "Failed to search jobs" },
      { status: 500 }
    );
  }
}
