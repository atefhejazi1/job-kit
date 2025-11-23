import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

// GET - Get specific application details
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const companyId = request.headers.get("x-company-id");
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const { id: applicationId } = await params;

    const application = await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        job: { companyId: companyId },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            workType: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// PATCH - Update application status or add notes (for companies)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const companyId = request.headers.get("x-company-id");
    
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const { id: applicationId } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // Verify that the application belongs to the company's job
    const application = await prisma.jobApplication.findFirst({
      where: {
        id: applicationId,
        job: { companyId: companyId },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or access denied" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (status && ['PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(status)) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update the application
    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// DELETE - Delete application (for companies or applicants)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const companyId = request.headers.get("x-company-id");
    const applicantEmail = request.headers.get("x-applicant-email");

    if (!companyId && !applicantEmail) {
      return NextResponse.json(
        { error: "Authorization required" },
        { status: 400 }
      );
    }

    const { id: applicationId } = await params;

    // Build where condition based on authorization
    const whereCondition: any = { id: applicationId };

    if (companyId) {
      whereCondition.job = { companyId: companyId };
    } else if (applicantEmail) {
      whereCondition.email = applicantEmail;
    }

    // Check if application exists
    const application = await prisma.jobApplication.findFirst({
      where: whereCondition,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the application
    await prisma.jobApplication.delete({
      where: { id: applicationId },
    });

    return NextResponse.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}