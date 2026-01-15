import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js 16+ Proxy
 * 
 * This file handles lightweight request interception for:
 * - Redirecting unauthenticated users to login
 * - Redirecting authenticated users away from login page
 * 
 * NOTE: Heavy authorization logic (role checks) is handled in API routes
 * and Server Actions, not here, as per Next.js security recommendations.
 */
export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // If user is on login page but already authenticated, redirect to dashboard
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If user tries to access dashboard routes without auth, redirect to login
    if (pathname.startsWith('/dashboard') && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
