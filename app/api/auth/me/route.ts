import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

interface MeResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
    userType: 'USER' | 'COMPANY';
    avatarUrl: string | null;
    companyId: string | null;
    createdAt: Date;
    updatedAt: Date;
    company?: {
      id: string;
      companyName: string;
      industry: string | null;
      logo: string | null;
    } | null;
    jobSeeker?: {
      id: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      city: string | null;
    } | null;
  };
}

interface ErrorResponse {
  error: string;
}

export async function GET(
  request: Request
): Promise<NextResponse<MeResponse | ErrorResponse>> {
  try {
    // Get token from cookie or header
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('access_token')?.value;
    const tokenFromHeader = extractTokenFromHeader(request.headers.get('authorization'));
    const token = tokenFromCookie || tokenFromHeader;

    // Also check legacy header auth
    const legacyUserId = request.headers.get('x-user-id');

    if (!token && !legacyUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let userId: string;

    if (token) {
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      userId = payload.userId;
    } else if (legacyUserId) {
      userId = legacyUserId;
    } else {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get full user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            companyName: true,
            industry: true,
            logo: true,
          },
        },
        jobSeeker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            city: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          ...user,
          companyId: user.company?.id || null,
          companyName: user.company?.companyName || null,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
