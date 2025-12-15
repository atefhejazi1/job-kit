import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[id] - Get user info
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const requesterId = req.headers.get("x-user-id");
    
    if (!requesterId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        userType: true,
        jobSeeker: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            currentPosition: true,
            experienceLevel: true,
            summary: true,
            skills: true,
            linkedInProfile: true,
            portfolioUrl: true,
            city: true,
            country: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user info
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const requesterId = req.headers.get("x-user-id");
    
    if (!requesterId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is updating their own profile
    if (requesterId !== id) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, avatarUrl, phone, currentPosition, experienceLevel, summary, skills, linkedInProfile, portfolioUrl, city, country } = body;

    // Update user basic info
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        userType: true,
      },
    });

    // Update job seeker data if user is not a company
    if (user.userType !== "COMPANY") {
      const jobSeekerData: any = {};
      if (phone !== undefined) jobSeekerData.phone = phone;
      if (currentPosition !== undefined) jobSeekerData.currentPosition = currentPosition;
      if (experienceLevel !== undefined) jobSeekerData.experienceLevel = experienceLevel;
      if (summary !== undefined) jobSeekerData.summary = summary;
      if (skills !== undefined) jobSeekerData.skills = skills;
      if (linkedInProfile !== undefined) jobSeekerData.linkedInProfile = linkedInProfile;
      if (portfolioUrl !== undefined) jobSeekerData.portfolioUrl = portfolioUrl;
      if (city !== undefined) jobSeekerData.city = city;
      if (country !== undefined) jobSeekerData.country = country;

      if (Object.keys(jobSeekerData).length > 0) {
        // Check if JobSeeker record exists
        const existingJobSeeker = await prisma.jobSeeker.findUnique({
          where: { userId: id },
        });

        if (existingJobSeeker) {
          // Update existing record
          await prisma.jobSeeker.update({
            where: { userId: id },
            data: jobSeekerData,
          });
        } else {
          // Create new record with required fields
          await prisma.jobSeeker.create({
            data: {
              userId: id,
              firstName: name?.split(" ")[0] || "User",
              lastName: name?.split(" ").slice(1).join(" ") || "",
              ...jobSeekerData,
            },
          });
        }
      }
    }

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
