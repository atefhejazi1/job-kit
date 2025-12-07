import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days
const JWT_REFRESH_EXPIRES_IN = '30d'; // Refresh token expires in 30 days

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  userType: 'USER' | 'COMPANY';
  companyId?: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token
 */
export async function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Generate refresh token (longer expiry)
 */
export async function generateRefreshToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_REFRESH_EXPIRES_IN)
    .sign(JWT_SECRET);
}

/**
 * Generate both access and refresh tokens
 */
export async function generateTokenPair(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<TokenPair> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload),
  ]);
  return { accessToken, refreshToken };
}

/**
 * Verify and decode a token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: TokenPayload): boolean {
  if (!payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get token expiration date
 */
export function getTokenExpirationDate(payload: TokenPayload): Date | null {
  if (!payload.exp) return null;
  return new Date(payload.exp * 1000);
}
