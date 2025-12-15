import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notificationService } from "@/lib/notifications";

interface Params {
  params: Promise<{ id: string }>;
}

// GET - Get specific application details
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const userId = request.headers.get("x-user-id");
    const companyId = request.headers.get("x-company-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    const { id: applicationId } = await params;

    // Build where clause based on user type
    const whereClause: any = {
      id: applicationId,
    };

    // If company user, filter by company
    if (companyId) {
      whereClause.job = { companyId: companyId };
    } else {
      // If regular user, filter by their user ID
      whereClause.userId = userId;
    }

    const application = await prisma.jobApplication.findFirst({
      where: whereClause,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            location: true,
            workType: true,
            salaryMin: true,
            salaryMax: true,
            currency: true,
            company: {
              select: {
                id: true,
                companyName: true,
                logo: true,
                website: true,
                location: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            jobSeeker: {
              select: {
                phone: true,
                skills: true,
                city: true,
              },
            },
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

    // Get user's latest resume
    const latestResume = await prisma.resume.findFirst({
      where: {
        userId: application.userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        summary: true,
        skills: true,
        experience: true,
        education: true,
        projects: true,
        languages: true,
        certifications: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Add resume data to application response
    const applicationWithResume = {
      ...application,
      resume: latestResume,
    };

    return NextResponse.json({ application: applicationWithResume });
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
            company: {
              select: {
                companyName: true
              }
            }
          },
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
    });

    // Send notification to applicant about status change
    if (status && updatedApplication.user?.id) {
      await notificationService.notifyApplicationStatusChange({
        applicantUserId: updatedApplication.user.id,
        status: status,
        jobTitle: updatedApplication.job.title,
        companyName: updatedApplication.job.company?.companyName || "Company",
        jobId: updatedApplication.job.id,
        applicationId: applicationId
      });
    }

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