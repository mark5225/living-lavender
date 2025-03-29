import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  // Get the pathname of the request
  const path = req.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/signup/basic',
    '/help',
    '/help/safety-tips',
    '/help/getting-started',
    '/about',
    '/contact',
    '/success-stories'
  ];
  
  // Check if the path starts with public API routes
  const isPublicApiPath = path.startsWith('/api/auth');
  
  // Check if the path is for static files or public paths
  const isPublicPath = publicPaths.some(pp => path === pp) || 
                       path.startsWith('/_next') || 
                       path.startsWith('/images') ||
                       path.startsWith('/uploads') ||
                       isPublicApiPath;
  
  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Check if the user is authenticated
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // If not authenticated and trying to access a protected route, redirect to login
  if (!token && !isPublicPath) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(req.url));
    return NextResponse.redirect(url);
  }
  
  // If authenticated, allow the request
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/auth (NextAuth.js authentication routes)
     * 2. /_next (Next.js internals)
     * 3. /images (Static files)
     * 4. /uploads (User uploads)
     * 5. /favicon.ico (Browser favicon request)
     */
    '/((?!_next|images|uploads|favicon.ico).*)',
  ],
};