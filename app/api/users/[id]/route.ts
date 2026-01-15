import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as { role?: string }).role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as { role?: string }).role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        // Prevent changing own role or status
    if (session && session.user && id === (session.user as { id?: string }).id) {
        delete body.role;
        delete body.status;
    }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

import { promises as fs } from 'fs';
import path from 'path';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await dbConnect();
        const { id } = await params;

        // Parse multipart/form-data
        const contentType = req.headers.get('content-type') || '';
        if (!contentType.startsWith('multipart/form-data')) {
            return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
        }

        // Use a third-party library like busboy or formidable for robust parsing in production.
        // For simplicity, use experimental formData API (Node.js 18+ / Next.js 13+)
        // @ts-ignore
        const formData = await req.formData();
        const file = formData.get('avatar');
        if (!file || typeof file === 'string') {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${id}_${Date.now()}.${ext}`;
        const filePath = path.join(process.cwd(), 'public', 'avatars', filename);

        // Save file to disk
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));

        // Save avatar URL to user
        const avatarUrl = `/avatars/${filename}`;
        const user = await User.findByIdAndUpdate(
            id,
            { $set: { avatar: avatarUrl } },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as { role?: string }).role !== 'owner') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    // Prevent deleting self
    if (session && session.user && id === (session.user as { id?: string }).id) {
        return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    try {
        await dbConnect();
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
