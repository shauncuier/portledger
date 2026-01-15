import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
    OWNER = 'owner',
    ACCOUNTANT = 'accountant',
    STAFF = 'staff',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    status: 'active' | 'inactive';
    avatar?: string; // URL to profile image
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STAFF,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        avatar: { type: String, default: '' },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ deletedAt: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
