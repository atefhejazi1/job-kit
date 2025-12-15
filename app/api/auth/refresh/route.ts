import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, generateAccessToken, TokenPayload } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

interface RefreshResponse {
  message: string;
  accessToken: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(request: Request): Promise<NextResponse<RefreshResponse | ErrorResponse>> {
  try {
    // Get refresh token from cookie or body
    const cookieStore = await cookies();
    const refreshTokenFromCookie = cookieStore.get('refresh_token')?.value;
    
    let refreshToken = refreshTokenFromCookie;
    
    // Also check request body
    if (!refreshToken) {
      try {
        const body = await request.json();
        refreshToken = body.refreshToken;
      } catch {
        // No body provided
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { company: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new access token
    const newTokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      userType: user.userType as 'USER' | 'COMPANY',
      companyId: user.userType === 'COMPANY' ? user.company?.id : null,
    };

    const accessToken = await generateAccessToken(newTokenPayload);

    // Create response with new access token cookie
    const response = NextResponse.json(
      {
        message: 'Token refreshed successfully',
        accessToken,
      },
      { status: 200 }
    );

    // Update access token cookie
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
