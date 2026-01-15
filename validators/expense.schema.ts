import { z } from 'zod';
import { ExpenseCategory } from '@/models/Expense';

export const expenseSchema = z.object({
    category: z.nativeEnum(ExpenseCategory),
    vendor_name: z.string().min(2, 'Vendor name is required'),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    payment_method: z.string().min(1, 'Payment method is required'),
    expense_date: z.coerce.date(),
    note: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
