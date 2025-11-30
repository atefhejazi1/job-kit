import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rolePermissions } from "@/types/team.types";
import { sendTeamInvitation } from "@/lib/email";

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        invitedAt: true,
        acceptedAt: true,
        canCreateJobs: true,
        canEditJobs: true,
        canDeleteJobs: true,
        canReviewApps: true,
        canEditCompany: true,
        canManageTeam: true,
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get("x-company-id");
    const body = await request.json();
    const { email, role } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Check if user already invited
    const existingMember = await prisma.teamMember.findFirst({
      where: { companyId, email },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "This user is already invited" },
        { status: 409 }
      );
    }

    // Get permissions for the role
    const permissions = rolePermissions[role as keyof typeof rolePermissions];
    if (!permissions) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Create team member
    const teamMember = await prisma.teamMember.create({
      data: {
        companyId,
        email,
        role,
        status: "PENDING",
        ...permissions,
      },
    });

    // Send invitation email
    try {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { companyName: true },
      });

      const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/company/team/accept/${teamMember.id}`;

      await sendTeamInvitation(
        email,
        company?.companyName || "JobKit",
        invitationLink
      );
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
    }

    return NextResponse.json(
      {
        message: "Invitation sent successfully",
        teamMember,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inviting team member:", error);
    return NextResponse.json(
      { error: "Failed to invite team member" },
      { status: 500 }
    );
  }
}
