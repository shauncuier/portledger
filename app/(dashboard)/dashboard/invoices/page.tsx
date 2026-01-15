'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    FileText,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Clock,
    Download,
    Loader2,
    X,
    Save,
    Trash2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Client {
    _id: string;
    name: string;
    company_name: string;
    email?: string;
    phone?: string;
    address?: string;
}

interface InvoiceItem {
    description: string;
    qty: number;
    rate: number;
    amount: number;
}

interface Invoice {
    _id: string;
    invoice_number: string;
    client_id: Client;
    invoice_date: string;
    due_date: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paid_amount: number;
    status: 'paid' | 'partial' | 'unpaid';
}

const emptyItem: InvoiceItem = { description: '', qty: 1, rate: 0, amount: 0 };

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        client_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ ...emptyItem }] as InvoiceItem[],
        tax: 0,
        discount: 0,
    });

    useEffect(() => {
        fetchInvoices();
        fetchClients();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/invoices');
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const data = await res.json();
            setInvoices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            const data = await res.json();
            setClients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch clients', error);
        }
    };

    const downloadInvoicePDF = (invoice: Invoice) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;

        // === HEADER SECTION ===
        // Blue accent bar at top
        doc.setFillColor(59, 130, 246); // blue-500
        doc.rect(0, 0, pageWidth, 8, 'F');

        // Company Name
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('ClearLedger', margin, 30);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text('Financial Management System', margin, 38);
        doc.text('Email: info@clearledger.com', margin, 45);
        doc.text('Phone: +880 1234-567890', margin, 52);

        // Invoice Badge
        doc.setFillColor(239, 246, 255); // blue-50
        doc.roundedRect(pageWidth - 75, 15, 55, 45, 3, 3, 'F');

        doc.setTextColor(59, 130, 246);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', pageWidth - 47.5, 30, { align: 'center' });

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.text(invoice.invoice_number, pageWidth - 47.5, 42, { align: 'center' });

        // Status Badge
        const statusColors: Record<string, [number, number, number]> = {
            paid: [34, 197, 94],
            partial: [245, 158, 11],
            unpaid: [239, 68, 68]
        };
        const statusColor = statusColors[invoice.status] || statusColors.unpaid;
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.status.toUpperCase(), pageWidth - 47.5, 54, { align: 'center' });

        // === BILL TO AND INVOICE INFO ===
        const infoY = 75;

        // Bill To Box
        doc.setFillColor(249, 250, 251); // gray-50
        doc.roundedRect(margin, infoY, 85, 45, 3, 3, 'F');

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO', margin + 5, infoY + 10);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(invoice.client_id?.company_name || 'N/A', margin + 5, infoY + 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(invoice.client_id?.name || '', margin + 5, infoY + 28);
        if (invoice.client_id?.email) {
            doc.text(invoice.client_id.email, margin + 5, infoY + 35);
        }
        if (invoice.client_id?.phone) {
            doc.text(invoice.client_id.phone, margin + 5, infoY + 42);
        }

        // Invoice Details Box
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(pageWidth - margin - 70, infoY, 70, 45, 3, 3, 'F');

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        const detailsX = pageWidth - margin - 65;
        doc.text('Invoice Date:', detailsX, infoY + 12);
        doc.text('Due Date:', detailsX, infoY + 24);
        doc.text('Balance Due:', detailsX, infoY + 36);

        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        const valuesX = pageWidth - margin - 5;
        doc.text(formatDate(invoice.invoice_date), valuesX, infoY + 12, { align: 'right' });
        doc.text(formatDate(invoice.due_date), valuesX, infoY + 24, { align: 'right' });

        const balance = invoice.total - invoice.paid_amount;
        if (balance > 0) {
            doc.setTextColor(239, 68, 68);
        } else {
            doc.setTextColor(34, 197, 94);
        }
        doc.text(formatCurrency(balance), valuesX, infoY + 36, { align: 'right' });

        // === LINE ITEMS TABLE ===
        const tableData = invoice.items.map((item, idx) => [
            (idx + 1).toString(),
            item.description,
            item.qty.toString(),
            formatCurrency(item.rate),
            formatCurrency(item.amount)
        ]);

        autoTable(doc, {
            startY: infoY + 55,
            head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
            body: tableData,
            theme: 'plain',
            headStyles: {
                fillColor: [30, 41, 59],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 9,
                cellPadding: 5,
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 5,
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251],
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 35, halign: 'right' },
                4: { cellWidth: 35, halign: 'right' },
            },
            margin: { left: margin, right: margin },
        });

        // === TOTALS SECTION ===
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        const totalsX = pageWidth - margin - 80;
        const totalsWidth = 80;

        // Totals background
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(totalsX - 5, finalY - 5, totalsWidth + 10, 55, 3, 3, 'F');

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        let currentY = finalY + 5;

        doc.text('Subtotal:', totalsX, currentY);
        doc.setTextColor(30, 41, 59);
        doc.text(formatCurrency(invoice.subtotal), totalsX + totalsWidth, currentY, { align: 'right' });
        currentY += 10;

        if (invoice.tax > 0) {
            doc.setTextColor(107, 114, 128);
            doc.text('Tax:', totalsX, currentY);
            doc.setTextColor(30, 41, 59);
            doc.text(formatCurrency(invoice.tax), totalsX + totalsWidth, currentY, { align: 'right' });
            currentY += 10;
        }

        if (invoice.discount > 0) {
            doc.setTextColor(107, 114, 128);
            doc.text('Discount:', totalsX, currentY);
            doc.setTextColor(34, 197, 94);
            doc.text(`-${formatCurrency(invoice.discount)}`, totalsX + totalsWidth, currentY, { align: 'right' });
            currentY += 10;
        }

        // Divider
        doc.setDrawColor(209, 213, 219);
        doc.line(totalsX, currentY, totalsX + totalsWidth, currentY);
        currentY += 8;

        // Grand Total
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Total:', totalsX, currentY);
        doc.setTextColor(59, 130, 246);
        doc.text(formatCurrency(invoice.total), totalsX + totalsWidth, currentY, { align: 'right' });

        // Paid amount
        currentY += 12;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Amount Paid:', totalsX, currentY);
        doc.setTextColor(34, 197, 94);
        doc.text(formatCurrency(invoice.paid_amount), totalsX + totalsWidth, currentY, { align: 'right' });

        // === FOOTER ===
        // Thank you message
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your business!', margin, pageHeight - 35);

        // Footer bar
        doc.setFillColor(30, 41, 59);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Generated by ClearLedger Financial Management System', pageWidth / 2, pageHeight - 10, { align: 'center' });

        // Save
        doc.save(`Invoice_${invoice.invoice_number}.pdf`);
    };

    const calculateTotals = () => {
        const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
        const total = subtotal + formData.tax - formData.discount;
        return { subtotal, total };
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'qty' || field === 'rate') {
            newItems[index].amount = newItems[index].qty * newItems[index].rate;
        }
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({ ...formData, items: [...formData.items, { ...emptyItem }] });
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: newItems });
        }
    };

    const openCreateModal = () => {
        setFormData({
            client_id: '',
            invoice_date: new Date().toISOString().split('T')[0],
            due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [{ ...emptyItem }],
            tax: 0,
            discount: 0,
        });
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const { subtotal, total } = calculateTotals();

        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    subtotal,
                    total,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create invoice');
            }

            await fetchInvoices();
            closeModal();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const statusConfig = {
        paid: { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
        partial: { color: 'bg-amber-50 text-amber-600', icon: Clock },
        unpaid: { color: 'bg-rose-50 text-rose-600', icon: AlertCircle },
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client_id?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { subtotal, total } = calculateTotals();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-1 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search invoices by number or client..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>New Invoice</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Number</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        No invoices found.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => {
                                    const StatusIcon = statusConfig[invoice.status]?.icon || AlertCircle;
                                    return (
                                        <tr key={invoice._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                                                    <span className="font-bold text-gray-900">{invoice.invoice_number}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm">{invoice.client_id?.name || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{invoice.client_id?.company_name || ''}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                                                        {formatDate(invoice.invoice_date)}
                                                    </div>
                                                    <div className="flex items-center text-xs font-medium text-rose-500">
                                                        <Calendar className="h-3 w-3 mr-2" />
                                                        Due: {formatDate(invoice.due_date)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1 text-sm">
                                                    <p className="font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                                                    <p className="text-xs text-emerald-600 font-medium">Paid: {formatCurrency(invoice.paid_amount)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={cn(
                                                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                                    statusConfig[invoice.status]?.color || 'bg-gray-100 text-gray-600'
                                                )}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {invoice.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => downloadInvoicePDF(invoice)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Download PDF"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Create New Invoice</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                    <select
                                        required
                                        value={formData.client_id}
                                        onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Client</option>
                                        {clients.map((client) => (
                                            <option key={client._id} value={client._id}>
                                                {client.company_name} ({client.name})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.invoice_date}
                                        onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.due_date}
                                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Line Items */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Line Items</label>
                                <div className="space-y-3">
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                required
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Qty"
                                                min="1"
                                                required
                                                value={item.qty}
                                                onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                                                className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Rate"
                                                min="0"
                                                step="0.01"
                                                required
                                                value={item.rate}
                                                onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                                                className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div className="w-28 px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                                                {formatCurrency(item.amount)}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700"
                                >
                                    + Add Line Item
                                </button>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-gray-500">Tax</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.tax}
                                            onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                                            className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-gray-500">Discount</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                                            className="w-24 px-2 py-1 border border-gray-200 rounded text-right text-sm"
                                        />
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span className="text-blue-600">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    <span>{saving ? 'Creating...' : 'Create Invoice'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
