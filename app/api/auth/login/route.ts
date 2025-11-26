import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { LoginRequest, AuthResponse, ErrorResponse, UserWithPassword } from '@/types/auth.types';

export async function POST(request: Request): Promise<NextResponse<AuthResponse | ErrorResponse>> {
  try {
    const { email, password }: LoginRequest = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: true
      }
    }) as (UserWithPassword & { company?: { id: string } }) | null;

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const { password: _, company, ...userWithoutPassword } = user;
    
    // Add company ID if user is a company
    const userResponse = {
      ...userWithoutPassword,
      companyId: user.userType === 'COMPANY' ? company?.id : null
    };

    console.log('Login response:', { 
      userType: userResponse.userType, 
      companyId: userResponse.companyId,
      hasCompany: !!company 
    });


    return NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}