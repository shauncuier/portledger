import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReportService } from '@/services/report.service';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    try {
        if (type === 'monthly') {
            const data = await ReportService.getMonthlyIncomeExpense(year);
            return NextResponse.json(data);
        }

        if (type === 'outstanding') {
            const data = await ReportService.getOutstandingReceivables();
            return NextResponse.json(data);
        }

        if (type === 'profit-loss') {
            const start = new Date(searchParams.get('start') || new Date(year, 0, 1));
            const end = new Date(searchParams.get('end') || new Date(year, 11, 31));
            const data = await ReportService.getProfitLoss(start, end);
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
