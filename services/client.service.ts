import dbConnect from '@/lib/db';
import Client, { IClient } from '@/models/Client';
import { ClientInput } from '@/validators/client.schema';

export class ClientService {
    static async getAllClients() {
        await dbConnect();
        return Client.find({ deletedAt: null }).sort({ createdAt: -1 });
    }

    static async getClientById(id: string) {
        await dbConnect();
        return Client.findOne({ _id: id, deletedAt: null });
    }

    static async createClient(data: ClientInput) {
        await dbConnect();
        const client = new Client(data);
        return client.save();
    }

    static async updateClient(id: string, data: Partial<ClientInput>) {
        await dbConnect();
        return Client.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );
    }

    static async deleteClient(id: string) {
        await dbConnect();
        return Client.findOneAndUpdate(
            { _id: id },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
    }
}
