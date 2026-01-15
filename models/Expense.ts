import mongoose, { Schema, Document } from 'mongoose';

export enum ExpenseCategory {
    PORT = 'Port',
    CUSTOMS = 'Customs',
    TRANSPORT = 'Transport',
    LABOUR = 'Labour',
    OFFICE = 'Office',
    MISC = 'Misc',
}

export interface IExpense extends Document {
    category: ExpenseCategory;
    vendor_name: string;
    amount: number;
    payment_method: string;
    expense_date: Date;
    note: string;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
    {
        category: {
            type: String,
            enum: Object.values(ExpenseCategory),
            required: true,
        },
        vendor_name: { type: String, required: true },
        amount: { type: Number, required: true, min: 0.01 },
        payment_method: { type: String, required: true },
        expense_date: { type: Date, required: true },
        note: { type: String },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ expense_date: 1 });
ExpenseSchema.index({ deletedAt: 1 });

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
