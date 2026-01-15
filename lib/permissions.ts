import { UserRole } from '@/models/User';

export const canAccessFinancials = (role: string) => {
    return [UserRole.OWNER, UserRole.ACCOUNTANT].includes(role as UserRole);
};

export const isOwner = (role: string) => {
    return role === UserRole.OWNER;
};

export const canEntryData = (role: string) => {
    return [UserRole.OWNER, UserRole.ACCOUNTANT, UserRole.STAFF].includes(role as UserRole);
};
