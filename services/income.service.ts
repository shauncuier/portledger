import dbConnect from '@/lib/db';
import Income, { IIncome } from '@/models/Income';
import Invoice, { InvoiceStatus } from '@/models/Invoice';
import { IncomeInput } from '@/validators/income.schema';
import mongoose from 'mongoose';

export class IncomeService {
    static async getAllIncome() {
        await dbConnect();
        return Income.find({ deletedAt: null })
            .populate('client_id', 'name company_name')
            .populate('invoice_id', 'invoice_number')
            .sort({ createdAt: -1 });
    }

    static async createIncome(data: IncomeInput) {
        await dbConnect();
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const invoice = await Invoice.findOne({ _id: data.invoice_id, deletedAt: null }).session(session);
            if (!invoice) throw new Error('Invoice not found');

            const remainingBalance = invoice.total - invoice.paid_amount;
            if (data.amount > remainingBalance) {
                throw new Error(`Payment amount (${data.amount}) exceeds remaining balance (${remainingBalance})`);
            }

            // Derive client_id from invoice if not provided
            const incomeData = {
                ...data,
                client_id: data.client_id || invoice.client_id.toString(),
            };

            const income = new Income(incomeData);
            await income.save({ session });

            // Update invoice paid amount and status
            invoice.paid_amount += data.amount;
            if (invoice.paid_amount >= invoice.total) {
                invoice.status = InvoiceStatus.PAID;
            } else if (invoice.paid_amount > 0) {
                invoice.status = InvoiceStatus.PARTIAL;
            }

            await invoice.save({ session });
            await session.commitTransaction();
            return income;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async deleteIncome(id: string) {
        await dbConnect();
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const income = await Income.findOne({ _id: id, deletedAt: null }).session(session);
            if (!income) throw new Error('Income record not found');

            const invoice = await Invoice.findOne({ _id: income.invoice_id }).session(session);
            if (invoice) {
                invoice.paid_amount -= income.amount;
                if (invoice.paid_amount <= 0) {
                    invoice.status = InvoiceStatus.UNPAID;
                } else if (invoice.paid_amount < invoice.total) {
                    invoice.status = InvoiceStatus.PARTIAL;
                }
                await invoice.save({ session });
            }

            income.deletedAt = new Date();
            await income.save({ session });

            await session.commitTransaction();
            return { message: 'Income record deleted and invoice updated' };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
