import { z } from 'zod';

export const invoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    qty: z.coerce.number().min(1, 'Quantity must be at least 1'),
    rate: z.coerce.number().min(0, 'Rate cannot be negative'),
    amount: z.coerce.number(),
});

export const invoiceSchema = z.object({
    client_id: z.string().min(1, 'Client is required'),
    invoice_date: z.coerce.date(),
    due_date: z.coerce.date(),
    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
    subtotal: z.coerce.number(),
    tax: z.coerce.number().default(0),
    discount: z.coerce.number().default(0),
    total: z.coerce.number(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
