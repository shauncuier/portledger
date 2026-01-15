import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Utility to check authorization in API routes.
 * Returns a NextResponse error if not authorized, or null if authorized.
 */
export async function requireAuth(allowedRoles?: string[]) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null };
    }

    return { error: null, session };
}

/**
 * Check if current user has one of the required roles
 */
export function hasRole(session: any, roles: string[]) {
    return session?.user?.role && roles.includes(session.user.role);
}
