import { z } from 'zod';

export const clientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    company_name: z.string().min(2, 'Company name must be at least 2 characters'),
    phone: z.string().min(5, 'Phone number must be at least 5 characters'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    opening_balance: z.coerce.number().min(0, 'Opening balance cannot be negative').default(0),
    status: z.enum(['active', 'inactive']).default('active'),
});

export type ClientInput = z.infer<typeof clientSchema>;
