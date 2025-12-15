import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get all saved companies for the user
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const [savedCompanies, total] = await Promise.all([
      prisma.savedCompany.findMany({
        where: { userId },
        include: {
          company: {
            select: {
              id: true,
              companyName: true,
              logo: true,
              industry: true,
              location: true,
              description: true,
              website: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.savedCompany.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      savedCompanies,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching saved companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved companies" },
      { status: 500 }
    );
  }
}

// POST - Save a company
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Check if already saved
    const existing = await prisma.savedCompany.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Company already saved" },
        { status: 400 }
      );
    }

    const savedCompany = await prisma.savedCompany.create({
      data: {
        userId,
        companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            industry: true,
            location: true,
            description: true,
            website: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Company saved successfully", savedCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving company:", error);
    return NextResponse.json(
      { error: "Failed to save company" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a saved company
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const savedCompany = await prisma.savedCompany.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!savedCompany) {
      return NextResponse.json(
        { error: "Saved company not found" },
        { status: 404 }
      );
    }

    await prisma.savedCompany.delete({
      where: { id: savedCompany.id },
    });

    return NextResponse.json({ message: "Company removed from saved" });
  } catch (error) {
    console.error("Error removing saved company:", error);
    return NextResponse.json(
      { error: "Failed to remove saved company" },
      { status: 500 }
    );
  }
}
