import { z } from 'zod';

export const incomeSchema = z.object({
    invoice_id: z.string().min(1, 'Invoice is required'),
    client_id: z.string().optional(), // Will be derived from invoice if not provided
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    payment_method: z.enum(['cash', 'bank', 'mobile']),
    received_date: z.coerce.date(),
    reference: z.string().optional(),
});

export type IncomeInput = z.infer<typeof incomeSchema>;
