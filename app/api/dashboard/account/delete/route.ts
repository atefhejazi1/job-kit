import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { currentPassword, userId } = body;

    // Validate current password
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true, jobSeeker: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 403 }
      );
    }

    // Delete account and related data
    if (user.userType === 'COMPANY') {
      const companyId = user.company?.id;
      
      if (companyId) {
        // Delete all job applications for jobs from this company
        await prisma.jobApplication.deleteMany({
          where: {
            job: {
              companyId: companyId
            }
          }
        });

        // Delete all jobs for this company
        await prisma.job.deleteMany({
          where: { companyId: companyId }
        });

        // Delete company profile
        await prisma.company.delete({
          where: { id: companyId }
        });
      }

      // Delete user
      await prisma.user.delete({
        where: { id: user.id }
      });
    } else {
      
      // Delete job applications submitted by this user
      await prisma.jobApplication.deleteMany({
        where: {
          email: user.email
        }
      });

      // Delete resumes
      await prisma.resume.deleteMany({
        where: { userId: user.id }
      });

      // Delete job seeker profile
      if (user.jobSeeker?.id) {
        await prisma.jobSeeker.delete({
          where: { id: user.jobSeeker.id }
        });
      }

      // Delete user
      await prisma.user.delete({
        where: { id: user.id }
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
