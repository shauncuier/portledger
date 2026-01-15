import dbConnect from '@/lib/db';
import Invoice, { IInvoice, InvoiceStatus } from '@/models/Invoice';
import { InvoiceInput } from '@/validators/invoice.schema';

export class InvoiceService {
    static async generateInvoiceNumber() {
        await dbConnect();
        const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
        const lastNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split('-')[1]) : 0;
        const newNumber = (lastNumber + 1).toString().padStart(5, '0');
        return `INV-${newNumber}`;
    }

    static async getAllInvoices() {
        await dbConnect();
        return Invoice.find({ deletedAt: null })
            .populate('client_id', 'name company_name')
            .sort({ createdAt: -1 });
    }

    static async getInvoiceById(id: string) {
        await dbConnect();
        return Invoice.findOne({ _id: id, deletedAt: null }).populate('client_id');
    }

    static async createInvoice(data: InvoiceInput) {
        await dbConnect();
        const invoice_number = await this.generateInvoiceNumber();
        const invoice = new Invoice({
            ...data,
            invoice_number,
            status: InvoiceStatus.UNPAID,
            paid_amount: 0,
        });
        return invoice.save();
    }

    static async updateInvoice(id: string, data: Partial<InvoiceInput>) {
        await dbConnect();
        const invoice = await Invoice.findOne({ _id: id, deletedAt: null });

        if (!invoice) throw new Error('Invoice not found');

        // Business rule: Invoice totals must be immutable after payment
        if (invoice.status !== InvoiceStatus.UNPAID && (data.total !== undefined || data.items !== undefined)) {
            throw new Error('Cannot modify invoice totals or items after payment has been received');
        }

        return Invoice.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );
    }

    static async deleteInvoice(id: string) {
        await dbConnect();
        const invoice = await Invoice.findOne({ _id: id });
        if (!invoice) throw new Error('Invoice not found');

        // Soft delete only
        invoice.deletedAt = new Date();
        return invoice.save();
    }
}
