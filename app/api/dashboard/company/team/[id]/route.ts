import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rolePermissions } from "@/types/team.types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = request.headers.get("x-company-id");
    const { id } = await params;
    const body = await request.json();
    const { role, ...customPermissions } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if team member exists and belongs to this company
    const teamMember = await prisma.teamMember.findFirst({
      where: { id, companyId },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    let updateData: any = {};

    if (role) {
      if (!rolePermissions[role as keyof typeof rolePermissions]) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }
      updateData.role = role;
      // Apply default permissions for the role
      updateData = {
        ...updateData,
        ...rolePermissions[role as keyof typeof rolePermissions],
      };
    }

    // Apply custom permissions if provided
    if (Object.keys(customPermissions).length > 0) {
      updateData = { ...updateData, ...customPermissions };
    }

    // Update team member
    const updated = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Team member updated successfully",
      teamMember: updated,
    });
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const companyId = request.headers.get("x-company-id");
    const { id } = await params;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if team member exists and belongs to this company
    const teamMember = await prisma.teamMember.findFirst({
      where: { id, companyId },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    // Cannot delete if it's the only admin
    if (teamMember.role === "ADMIN") {
      const adminCount = await prisma.teamMember.count({
        where: { companyId, role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin" },
          { status: 400 }
        );
      }
    }

    // Delete team member
    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({
      message: "Team member removed successfully",
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
