import dbConnect from '@/lib/db';
import Expense, { IExpense } from '@/models/Expense';
import { ExpenseInput } from '@/validators/expense.schema';

export class ExpenseService {
    static async getAllExpenses() {
        await dbConnect();
        return Expense.find({ deletedAt: null }).sort({ expense_date: -1 });
    }

    static async getExpenseById(id: string) {
        await dbConnect();
        return Expense.findOne({ _id: id, deletedAt: null });
    }

    static async createExpense(data: ExpenseInput) {
        await dbConnect();
        const expense = new Expense(data);
        return expense.save();
    }

    static async updateExpense(id: string, data: Partial<ExpenseInput>) {
        await dbConnect();
        return Expense.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );
    }

    static async deleteExpense(id: string) {
        await dbConnect();
        return Expense.findOneAndUpdate(
            { _id: id },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
    }
}
