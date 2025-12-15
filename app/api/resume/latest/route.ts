import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lastResume = await prisma.resume.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resume: lastResume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}
