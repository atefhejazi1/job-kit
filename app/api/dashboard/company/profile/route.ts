import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get company ID from request headers
    const companyId = request.headers.get('x-company-id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required. Please ensure you are logged in.' },
        { status: 401 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });

  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const updates = await request.json();
    
    // Get company ID from request headers
    const companyId = request.headers.get('x-company-id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required. Please ensure you are logged in.' },
        { status: 401 }
      );
    }
    
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const updatedCompany = await prisma.company.update({
      where: { id: existingCompany.id },
      data: {
        companyName: updates.companyName,
        industry: updates.industry,
        companySize: updates.companySize,
        location: updates.location,
        website: updates.website || null,
        description: updates.description,
        logo: updates.logo || null,
        contactPhone: updates.contactPhone,
        contactEmail: updates.contactEmail,
        establishedYear: updates.establishedYear || null,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Company settings updated successfully',
      company: updatedCompany
    });

  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}