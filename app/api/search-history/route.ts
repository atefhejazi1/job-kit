import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Get search history
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.searchHistory.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      history,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    return NextResponse.json(
      { error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}

// POST - Save search query to history
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, filters } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const searchEntry = await prisma.searchHistory.create({
      data: {
        userId,
        query: query.trim(),
        filters: filters || null,
      },
    });

    return NextResponse.json(
      { message: "Search saved to history", searchEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving to search history:", error);
    return NextResponse.json(
      { error: "Failed to save search history" },
      { status: 500 }
    );
  }
}

// DELETE - Clear search history
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const searchId = searchParams.get("searchId");

    if (searchId) {
      // Delete specific search
      const search = await prisma.searchHistory.findUnique({
        where: { id: searchId },
      });

      if (!search || search.userId !== userId) {
        return NextResponse.json(
          { error: "Search not found" },
          { status: 404 }
        );
      }

      await prisma.searchHistory.delete({
        where: { id: searchId },
      });

      return NextResponse.json({ message: "Search removed from history" });
    } else {
      // Clear all search history
      await prisma.searchHistory.deleteMany({
        where: { userId },
      });

      return NextResponse.json({ message: "Search history cleared" });
    }
  } catch (error) {
    console.error("Error deleting search history:", error);
    return NextResponse.json(
      { error: "Failed to delete search history" },
      { status: 500 }
    );
  }
}
