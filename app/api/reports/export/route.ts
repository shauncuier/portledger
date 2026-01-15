import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Income from '@/models/Income';
import Expense from '@/models/Expense';
import Invoice from '@/models/Invoice';
import Client from '@/models/Client';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all';

    await dbConnect();

    try {
        let data: any = {};

        // Clients data
        if (type === 'all' || type === 'clients') {
            const clients = await Client.find({ deletedAt: null }).lean();
            data.clients = clients;
        }

        // Invoices data
        if (type === 'all' || type === 'invoices') {
            const invoices = await Invoice.find({ deletedAt: null })
                .populate('client_id', 'name company_name')
                .lean();
            data.invoices = invoices;
        }

        // Income data
        if (type === 'all' || type === 'income') {
            const income = await Income.find({ deletedAt: null })
                .populate('client_id', 'name company_name')
                .populate('invoice_id', 'invoice_number')
                .lean();
            data.income = income;
        }

        // Expenses data
        if (type === 'all' || type === 'expenses') {
            const expenses = await Expense.find({ deletedAt: null }).lean();
            data.expenses = expenses;
        }

        // Profit & Loss report
        if (type === 'all' || type === 'profit-loss' || type === 'summary') {
            const totalIncome = await Income.aggregate([
                { $match: { deletedAt: null } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const totalExpense = await Expense.aggregate([
                { $match: { deletedAt: null } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const expenseByCategory = await Expense.aggregate([
                { $match: { deletedAt: null } },
                { $group: { _id: '$category', total: { $sum: '$amount' } } }
            ]);

            data.summary = {
                totalIncome: totalIncome[0]?.total || 0,
                totalExpense: totalExpense[0]?.total || 0,
                netProfit: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
                expensesByCategory: expenseByCategory.reduce((acc: any, item: any) => {
                    acc[item._id] = item.total;
                    return acc;
                }, {})
            };
        }

        // Outstanding receivables report
        if (type === 'all' || type === 'outstanding') {
            const outstandingInvoices = await Invoice.find({
                status: { $ne: 'paid' },
                deletedAt: null
            })
                .populate('client_id', 'name company_name')
                .lean();

            const totalOutstanding = outstandingInvoices.reduce((sum: number, inv: any) => {
                return sum + (inv.total - inv.paid_amount);
            }, 0);

            data.invoices = outstandingInvoices;
            data.summary = {
                ...data.summary,
                outstandingReceivables: totalOutstanding,
                outstandingCount: outstandingInvoices.length
            };
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
    }
}
