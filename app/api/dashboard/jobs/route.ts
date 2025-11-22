import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateJobRequest, JobResponse } from '@/types/job.types';

export async function POST(request: Request): Promise<NextResponse<JobResponse | { error: string }>> {
  try {
    const requestData: CreateJobRequest = await request.json();
    
    const {
      title,
      description,
      requirements,
      location,
      workType,
      salaryMin,
      salaryMax,
      currency = 'USD',
      benefits,
      skills,
      experienceLevel,
      deadline
    } = requestData;

    // Basic validation
    if (!title || !description || !location || !workType || !experienceLevel) {
      return NextResponse.json(
        { error: 'Title, description, location, work type, and experience level are required' },
        { status: 400 }
      );
    }

    if (!requirements || requirements.length === 0) {
      return NextResponse.json(
        { error: 'At least one requirement is needed' },
        { status: 400 }
      );
    }

    if (!skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'At least one skill is needed' },
        { status: 400 }
      );
    }

    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      return NextResponse.json(
        { error: 'Maximum salary must be greater than minimum salary' },
        { status: 400 }
      );
    }

    // Get company ID from request headers (in real app, this would come from session/JWT)
    const companyId = request.headers.get('x-company-id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required. Please ensure you are logged in.' },
        { status: 401 }
      );
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found.' },
        { status: 404 }
      );
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        companyId: companyId,
        title: title.trim(),
        description: description.trim(),
        requirements: requirements.filter(req => req.trim()),
        location: location.trim(),
        workType,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        currency,
        benefits: benefits.filter(benefit => benefit.trim()),
        skills: skills.filter(skill => skill.trim()),
        experienceLevel,
        deadline: deadline ? new Date(deadline) : null,
        isActive: true
      },
      include: {
        company: {
          select: {
            companyName: true,
            location: true,
            logo: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Job created successfully',
        job
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<NextResponse<{ jobs: any[], total: number } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const workType = searchParams.get('workType') || '';
    const experienceLevel = searchParams.get('experienceLevel') || '';

    // Get company ID from request headers
    const companyId = request.headers.get('x-company-id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required. Please ensure you are logged in.' },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause - only show jobs for this company
    const where: any = {
      companyId: companyId,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (workType) {
      where.workType = workType;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              companyName: true,
              location: true,
              logo: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);

    return NextResponse.json({
      jobs,
      total
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}