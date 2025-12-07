import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Fetch latest resume for the user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the most recent resume
    const resume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("GET Resume Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

// DELETE - Remove user resume
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if resume exists
    const resume = await prisma.resume.findFirst({
      where: { userId },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    await prisma.resume.delete({
      where: { id: resume.id },
    });

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Resume Error:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}

// PUT - Update existing resume or create a new one
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    console.log("PUT data received:", data);

    if (!data.userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const existingResume = await prisma.resume.findFirst({
      where: { userId: data.userId },
    });

    if (existingResume) {
      // Update existing resume
      const updatedResume = await prisma.resume.update({
        where: { id: existingResume.id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          summary: data.summary,
          skills: data.skills,
          languages: data.languages,
          education: data.education,
          experience: data.experience,
          projects: data.projects,
        },
      });

      console.log("Updated existing resume:", updatedResume);
      return NextResponse.json(updatedResume, { status: 200 });
    } else {
      // Create new resume
      const newResume = await prisma.resume.create({
        data: {
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          summary: data.summary,
          skills: data.skills,
          languages: data.languages,
          education: data.education,
          experience: data.experience,
          projects: data.projects,
        },
      });

      console.log("Created new resume:", newResume);
      return NextResponse.json(newResume, { status: 201 });
    }
  } catch (error) {
    console.error("PUT Resume Error:", error);
    return NextResponse.json(
      { message: "Error saving resume", error: String(error) },
      { status: 500 }
    );
  }
}

// POST - Create a new resume
export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Received data:", data);

    if (!data.userId) {
      return NextResponse.json(
        { message: "User ID is required to save resume." },
        { status: 400 }
      );
    }

    const resume = await prisma.resume.create({
      data: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        summary: data.summary,
        skills: data.skills,
        languages: data.languages,
        education: data.education,
        experience: data.experience,
        projects: data.projects,
      },
    });

    console.log("Saved resume:", resume);
    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/resume:", error);
    return NextResponse.json(
      { message: "Error saving resume to database.", error: String(error) },
      { status: 500 }
    );
  }
}
