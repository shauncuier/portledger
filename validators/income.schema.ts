import { z } from 'zod';
import { PaymentMethod } from '@/models/Income';

export const incomeSchema = z.object({
    invoice_id: z.string().min(1, 'Invoice is required'),
    client_id: z.string().min(1, 'Client is required'),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    payment_method: z.nativeEnum(PaymentMethod),
    received_date: z.coerce.date(),
    reference: z.string().optional(),
});

export type IncomeInput = z.infer<typeof incomeSchema>;
