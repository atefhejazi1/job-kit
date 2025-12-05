import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Create conversation from job application
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const companyId = request.headers.get("x-company-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Find a job application for this company
    const jobApplication = await prisma.jobApplication.findFirst({
      where: {
        job: {
          company: {
            userId: companyId || userId
          }
        }
      },
      include: {
        job: {
          include: {
            company: {
              include: {
                user: true
              }
            }
          }
        },
        user: {
          include: {
            jobSeeker: true
          }
        }
      }
    });

    if (!jobApplication) {
      return NextResponse.json({
        error: "No job applications found. You need job applications to create conversations."
      }, { status: 404 });
    }

    const applicantUser = jobApplication.user;

    // Create or find existing thread
    let thread = await prisma.messageThread.findFirst({
      where: {
        companyId: companyId || userId,
        applicantId: applicantUser.id,
        jobId: jobApplication.jobId
      }
    });

    if (!thread) {
      thread = await prisma.messageThread.create({
        data: {
          companyId: companyId || userId,
          applicantId: applicantUser.id,
          jobId: jobApplication.jobId,
          lastMessage: `Hi, I applied for the ${jobApplication.job.title} position.`,
          lastMessageAt: new Date()
        }
      });

      // Create initial message from applicant
      await prisma.message.create({
        data: {
          threadId: thread.id,
          senderId: applicantUser.id,
          receiverId: companyId || userId,
          content: `Hi, I applied for the ${jobApplication.job.title} position. I'm very interested in this opportunity and would love to discuss it further.`
        }
      });
    }

    return NextResponse.json({
      success: true,
      threadId: thread.id,
      message: `Conversation created with ${applicantUser.name} for ${jobApplication.job.title} position`
    });

  } catch (error) {
    console.error("Error creating conversation from job application:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}