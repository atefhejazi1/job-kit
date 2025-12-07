import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createApiHeaders } from '@/lib/api-utils';
import { notificationService } from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId },
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
            skills: true,
            deadline: true,
            createdAt: true,
            company: {
              select: {
                id: true,
                companyName: true,
                logo: true,
                location: true,
                industry: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(applications, {
      headers: createApiHeaders(null)
    });
  } catch (error) {
    console.error('Job Applications API Error:', error); 
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { jobId, coverLetter } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Check if user already applied for this job
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId,
          userId
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied for this job' }, { status: 400 });
    }

    // Check if job exists and is active
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        isActive: true
      },
      include: {
        company: {
          select: {
            companyName: true
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or inactive' }, { status: 404 });
    }

    // Check if deadline has passed
    if (job.deadline && new Date() > job.deadline) {
      return NextResponse.json({ error: 'Application deadline has passed' }, { status: 400 });
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        coverLetter,
        status: 'PENDING'
      },
      include: {
        job: {
          select: {
            title: true,
            company: {
              select: {
                companyName: true,
                userId: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Send notification to company
    if (application.job.company.userId) {
      await notificationService.notifyNewApplication({
        companyUserId: application.job.company.userId,
        applicantName: application.user.name,
        jobTitle: application.job.title,
        jobId: jobId,
        applicationId: application.id
      });
    }

    return NextResponse.json({
      message: 'Application submitted successfully',
      application
    }, {
      status: 201,
      headers: createApiHeaders(null)
    });

  } catch (error) {
    console.error('Job Application POST Error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}