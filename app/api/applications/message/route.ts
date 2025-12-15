import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/applications/message - Create conversation with specific applicant
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const companyId = request.headers.get("x-company-id");
    const { applicationId } = await request.json();

    if (!userId || !applicationId) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // Find the specific application
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                userId: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            jobSeeker: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Verify this application belongs to the company
    const actualCompanyUserId = application.job.company.userId;
    
    // Check if either userId or companyId matches the company owner
    const isAuthorized = actualCompanyUserId === userId || actualCompanyUserId === companyId;
    
    if (!isAuthorized) {
      return NextResponse.json({ 
        error: "Unauthorized - This application doesn't belong to your company" 
      }, { status: 403 });
    }

    // Create or find existing thread
    const threadCompanyId = application.job.company.userId;
    const threadApplicantId = application.userId;
    const threadJobId = application.jobId;
    
    console.log("Creating thread with:", { threadCompanyId, threadApplicantId, threadJobId });
    
    let thread = await prisma.messageThread.findFirst({
      where: {
        companyId: threadCompanyId,
        applicantId: threadApplicantId,
        jobId: threadJobId
      }
    });

    if (!thread) {
      thread = await prisma.messageThread.create({
        data: {
          companyId: threadCompanyId,
          applicantId: threadApplicantId,
          jobId: threadJobId,
          lastMessage: `Started conversation about ${application.job.title} position`,
          lastMessageAt: new Date()
        }
      });
      console.log("Thread created successfully:", thread.id);
    } else {
      console.log("Found existing thread:", thread.id);
    }

    return NextResponse.json({
      success: true,
      threadId: thread.id,
      message: `Conversation started with ${application.user.name} for ${application.job.title} position`
    });

  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: `Failed to create conversation: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}