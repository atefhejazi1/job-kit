import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const RESET_TOKEN_SECRET = new TextEncoder().encode(
  process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET || 'reset-secret-key'
);

interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: Request
): Promise<NextResponse<ResetPasswordResponse | ErrorResponse>> {
  try {
    const { token, password, confirmPassword }: ResetPasswordRequest = await request.json();

    // Validate input
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Token, password, and confirm password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify reset token
    let payload;
    try {
      const result = await jwtVerify(token, RESET_TOKEN_SECRET);
      payload = result.payload as { userId: string; email: string; purpose: string };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Verify token purpose
    if (payload.purpose !== 'password-reset') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify email matches
    if (user.email !== payload.email) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log('Password reset successful for:', user.email);

    return NextResponse.json(
      { message: 'Password has been reset successfully. You can now log in with your new password.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
