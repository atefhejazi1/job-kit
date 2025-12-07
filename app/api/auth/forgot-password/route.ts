import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const RESET_TOKEN_SECRET = new TextEncoder().encode(
  process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET || 'reset-secret-key'
);

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
  // In production, you would NOT return the token - only send via email
  // This is for development/testing only
  resetToken?: string;
}

interface ErrorResponse {
  error: string;
}

export async function POST(
  request: Request
): Promise<NextResponse<ForgotPasswordResponse | ErrorResponse>> {
  try {
    const { email }: ForgotPasswordRequest = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { 
          message: 'If an account with that email exists, a password reset link has been sent.' 
        },
        { status: 200 }
      );
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = await new SignJWT({ 
      userId: user.id, 
      email: user.email,
      purpose: 'password-reset' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(RESET_TOKEN_SECRET);

    // In production, you would:
    // 1. Store the token hash in the database with expiry
    // 2. Send an email with the reset link
    // Example:
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   html: `
    //     <p>You requested a password reset.</p>
    //     <p>Click <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">here</a> to reset your password.</p>
    //     <p>This link expires in 1 hour.</p>
    //   `
    // });

    console.log('Password reset requested for:', email);
    console.log('Reset token (for development only):', resetToken);

    // For development, return the token (REMOVE IN PRODUCTION)
    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json(
      { 
        message: 'If an account with that email exists, a password reset link has been sent.',
        ...(isDev && { resetToken }), // Only include in development
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
