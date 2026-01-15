import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';

export class UserService {
    static async getAllUsers() {
        await dbConnect();
        return User.find({ deletedAt: null }).select('-password').sort({ createdAt: -1 });
    }

    static async createUser(data: any) {
        await dbConnect();
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new User({
            ...data,
            password: hashedPassword,
        });
        return user.save();
    }

    static async updateUser(id: string, data: any) {
        await dbConnect();
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return User.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        ).select('-password');
    }

    static async deleteUser(id: string) {
        await dbConnect();
        return User.findOneAndUpdate(
            { _id: id },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
    }
}
