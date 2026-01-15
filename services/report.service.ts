import dbConnect from '@/lib/db';
import Income from '@/models/Income';
import Expense from '@/models/Expense';
import Invoice from '@/models/Invoice';
import mongoose from 'mongoose';

export class ReportService {
    static async getMonthlyIncomeExpense(year: number) {
        await dbConnect();

        const incomeMatch = {
            received_date: {
                $gte: new Date(year, 0, 1),
                $lte: new Date(year, 11, 31, 23, 59, 59),
            },
            deletedAt: null,
        };

        const expenseMatch = {
            expense_date: {
                $gte: new Date(year, 0, 1),
                $lte: new Date(year, 11, 31, 23, 59, 59),
            },
            deletedAt: null,
        };

        const incomeStats = await Income.aggregate([
            { $match: incomeMatch },
            {
                $group: {
                    _id: { $month: '$received_date' },
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const expenseStats = await Expense.aggregate([
            { $match: expenseMatch },
            {
                $group: {
                    _id: { $month: '$expense_date' },
                    total: { $sum: '$amount' },
                },
            },
        ]);

        // Merge results for 12 months
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const result = months.map((month) => {
            const inc = incomeStats.find((s) => s._id === month)?.total || 0;
            const exp = expenseStats.find((s) => s._id === month)?.total || 0;
            return {
                month: new Date(year, month - 1).toLocaleString('default', { month: 'short' }),
                income: inc,
                expense: exp,
                profit: inc - exp,
            };
        });

        return result;
    }

    static async getOutstandingReceivables() {
        await dbConnect();
        return Invoice.aggregate([
            { $match: { status: { $ne: 'paid' }, deletedAt: null } },
            {
                $group: {
                    _id: '$client_id',
                    total_due: { $sum: { $subtract: ['$total', '$paid_amount'] } },
                    invoice_count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'client',
                },
            },
            { $unwind: '$client' },
            {
                $project: {
                    client_name: '$client.name',
                    company_name: '$client.company_name',
                    total_due: 1,
                    invoice_count: 1,
                },
            },
            { $sort: { total_due: -1 } },
        ]);
    }

    static async getProfitLoss(startDate: Date, endDate: Date) {
        await dbConnect();

        const totalIncome = await Income.aggregate([
            { $match: { received_date: { $gte: startDate, $lte: endDate }, deletedAt: null } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { expense_date: { $gte: startDate, $lte: endDate }, deletedAt: null } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const expenseByCategory = await Expense.aggregate([
            { $match: { expense_date: { $gte: startDate, $lte: endDate }, deletedAt: null } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
        ]);

        return {
            income: totalIncome[0]?.total || 0,
            expense: totalExpense[0]?.total || 0,
            netProfit: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            expenseBreakdown: expenseByCategory,
        };
    }
}
