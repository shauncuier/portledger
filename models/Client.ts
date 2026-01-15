import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    name: string;
    company_name: string;
    phone: string;
    email: string;
    address: string;
    opening_balance: number;
    status: 'active' | 'inactive';
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        company_name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        address: { type: String, required: true },
        opening_balance: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes
ClientSchema.index({ email: 1 });
ClientSchema.index({ company_name: 1 });
ClientSchema.index({ deletedAt: 1 });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
