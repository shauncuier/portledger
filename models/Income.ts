import mongoose, { Schema, Document } from 'mongoose';

export enum PaymentMethod {
    CASH = 'cash',
    BANK = 'bank',
    MOBILE = 'mobile',
}

export interface IIncome extends Document {
    invoice_id: mongoose.Types.ObjectId;
    client_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: PaymentMethod;
    received_date: Date;
    reference: string;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const IncomeSchema: Schema = new Schema(
    {
        invoice_id: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
        client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        amount: { type: Number, required: true, min: 0.01 },
        payment_method: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true,
        },
        received_date: { type: Date, required: true },
        reference: { type: String },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes
IncomeSchema.index({ invoice_id: 1 });
IncomeSchema.index({ client_id: 1 });
IncomeSchema.index({ received_date: 1 });
IncomeSchema.index({ deletedAt: 1 });

export default mongoose.models.Income || mongoose.model<IIncome>('Income', IncomeSchema);
