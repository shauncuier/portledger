import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ClientService } from '@/services/client.service';
import { clientSchema } from '@/validators/client.schema';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const client = await ClientService.getClientById(id);
        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        return NextResponse.json(client);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch client' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const validatedData = clientSchema.partial().parse(body);
        const client = await ClientService.updateClient(id, validatedData);
        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        return NextResponse.json(client);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const client = await ClientService.deleteClient(id);
        if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        return NextResponse.json({ message: 'Client deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 });
    }
}
