import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { LoginRequest, ErrorResponse, UserWithPassword } from '@/types/auth.types';
import { generateTokenPair, TokenPayload } from '@/lib/jwt';
import { checkRateLimit, getClientIdentifier, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

interface LoginResponse {
  message: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    userType: 'USER' | 'COMPANY';
    avatarUrl?: string | null;
    companyId?: string | null;
    createdAt: Date;
    updatedAt?: Date;
  };
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request): Promise<NextResponse<LoginResponse | ErrorResponse>> {
  // Check rate limit
  const clientId = getClientIdentifier(request);
  const { isLimited, remaining, resetIn } = checkRateLimit(
    `login:${clientId}`,
    RATE_LIMIT_CONFIGS.auth
  );

  if (isLimited) {
    const res = NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
    const headers = getRateLimitHeaders(remaining, resetIn, RATE_LIMIT_CONFIGS.auth.maxRequests);
    Object.entries(headers).forEach(([key, value]) => res.headers.set(key, value));
    res.headers.set('Retry-After', Math.ceil(resetIn / 1000).toString());
    return res;
  }

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
    
    // Get company ID if user is a company
    const companyId = user.userType === 'COMPANY' ? company?.id : null;

    // Generate JWT tokens
    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      userType: user.userType as 'USER' | 'COMPANY',
      companyId,
    };

    const { accessToken, refreshToken } = await generateTokenPair(tokenPayload);

    // Create response with cookies
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          ...userWithoutPassword,
          companyId,
        },
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );

    // Set HTTP-only cookies for tokens
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    console.log('Login response:', { 
      userType: userWithoutPassword.userType, 
      companyId,
      hasCompany: !!company,
      tokenGenerated: true,
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}