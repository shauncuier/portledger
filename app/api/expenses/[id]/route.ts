import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ExpenseService } from '@/services/expense.service';
import { expenseSchema } from '@/validators/expense.schema';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const expense = await ExpenseService.getExpenseById(id);
        if (!expense) {
            return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
        }
        return NextResponse.json(expense);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
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
        const validatedData = expenseSchema.parse(body);
        const expense = await ExpenseService.updateExpense(id, validatedData);
        return NextResponse.json(expense);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
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
        await ExpenseService.deleteExpense(id);
        return NextResponse.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }
}
