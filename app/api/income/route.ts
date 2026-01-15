import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { IncomeService } from '@/services/income.service';
import { incomeSchema } from '@/validators/income.schema';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const income = await IncomeService.getAllIncome();
        return NextResponse.json(income);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const validatedData = incomeSchema.parse(body);
        const income = await IncomeService.createIncome(validatedData);
        return NextResponse.json(income, { status: 201 });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 500 });
    }
}
