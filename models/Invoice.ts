import mongoose, { Schema, Document } from 'mongoose';

export enum InvoiceStatus {
    UNPAID = 'unpaid',
    PARTIAL = 'partial',
    PAID = 'paid',
}

interface IInvoiceItem {
    description: string;
    qty: number;
    rate: number;
    amount: number;
}

export interface IInvoice extends Document {
    invoice_number: string;
    client_id: mongoose.Types.ObjectId;
    invoice_date: Date;
    due_date: Date;
    items: IInvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paid_amount: number;
    status: InvoiceStatus;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
    {
        invoice_number: { type: String, required: true, unique: true },
        client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        invoice_date: { type: Date, required: true },
        due_date: { type: Date, required: true },
        items: [
            {
                description: { type: String, required: true },
                qty: { type: Number, required: true, min: 1 },
                rate: { type: Number, required: true, min: 0 },
                amount: { type: Number, required: true },
            },
        ],
        subtotal: { type: Number, required: true, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
        paid_amount: { type: Number, default: 0, min: 0 },
        status: {
            type: String,
            enum: Object.values(InvoiceStatus),
            default: InvoiceStatus.UNPAID,
        },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes
InvoiceSchema.index({ invoice_number: 1 });
InvoiceSchema.index({ client_id: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ deletedAt: 1 });

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
