import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/jobs',
  '/privacy',
  '/terms',
  '/about',
  '/contact',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/jobs', // Public job listings
];

// Routes that start with these prefixes are public
const publicPrefixes = [
  '/api/jobs/', // Individual job details
  '/jobs/',
  '/_next',
  '/favicon',
  '/public',
  '/shapes',
  '/resumeSteps',
  '/WhyChooseUs',
];

// Routes only for authenticated users (not companies)
const userOnlyRoutes = [
  '/dashboard/user',
  '/apply',
  '/api/job-applications',
  '/api/saved-jobs',
  '/api/saved-companies',
];

// Routes only for companies
const companyOnlyRoutes = [
  '/dashboard/company',
  '/api/dashboard/company',
];

// Static file extensions that should be excluded from middleware
const staticExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.css', '.js', '.woff', '.woff2', '.ttf', '.eot'];

function isStaticFile(pathname: string): boolean {
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

function isPublicRoute(pathname: string): boolean {
  // Skip static files
  if (isStaticFile(pathname)) return true;
  
  // Check exact matches
  if (publicRoutes.includes(pathname)) return true;
  
  // Check prefix matches
  for (const prefix of publicPrefixes) {
    if (pathname.startsWith(prefix)) return true;
  }
  
  return false;
}

function isUserOnlyRoute(pathname: string): boolean {
  return userOnlyRoutes.some(route => pathname.startsWith(route));
}

function isCompanyOnlyRoute(pathname: string): boolean {
  return companyOnlyRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Get token from cookie or header
  const tokenFromCookie = request.cookies.get('access_token')?.value;
  const tokenFromHeader = extractTokenFromHeader(request.headers.get('authorization'));
  const token = tokenFromCookie || tokenFromHeader;
  
  // Also check for legacy header-based auth (for backward compatibility)
  const legacyUserId = request.headers.get('x-user-id');
  const legacyCompanyId = request.headers.get('x-company-id');
  
  // If no token and no legacy auth, redirect to login (for pages) or return 401 (for API)
  if (!token && !legacyUserId) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If using legacy auth, allow for now (backward compatibility)
  if (legacyUserId && !token) {
    // Add a warning header to indicate legacy auth is being used
    const response = NextResponse.next();
    response.headers.set('X-Auth-Warning', 'Using legacy authentication. Please upgrade to JWT.');
    return response;
  }
  
  // Verify JWT token
  if (token) {
    const payload = await verifyToken(token);
    
    if (!payload) {
      // Token is invalid or expired
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }
      
      // Clear the invalid cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
    
    // Check role-based access
    if (isUserOnlyRoute(pathname) && payload.userType !== 'USER') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Access denied. This route is for job seekers only.' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/dashboard/company', request.url));
    }
    
    if (isCompanyOnlyRoute(pathname) && payload.userType !== 'COMPANY') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Access denied. This route is for companies only.' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
    
    // Add user info to headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-email', payload.email);
    response.headers.set('x-user-type', payload.userType);
    if (payload.companyId) {
      response.headers.set('x-company-id', payload.companyId);
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
