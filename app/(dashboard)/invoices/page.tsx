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
    Filter
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Invoice {
    _id: string;
    invoice_number: string;
    client_id: {
        _id: string;
        name: string;
        company_name: string;
    };
    invoice_date: string;
    due_date: string;
    total: number;
    paid_amount: number;
    status: 'paid' | 'partial' | 'unpaid';
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/invoices');
            const data = await res.json();
            setInvoices(data);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        paid: { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
        partial: { color: 'bg-amber-50 text-amber-600', icon: Clock },
        unpaid: { color: 'bg-rose-50 text-rose-600', icon: AlertCircle },
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client_id.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <button className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 flex items-center space-x-2 transition-all shadow-sm">
                        <Filter className="h-4 w-4" />
                        <span className="text-sm font-medium">Filters</span>
                    </button>
                </div>
                <button
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
                                    const StatusIcon = statusConfig[invoice.status].icon;
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
                                                    <p className="font-semibold text-gray-900 text-sm">{invoice.client_id.name}</p>
                                                    <p className="text-xs text-gray-500">{invoice.client_id.company_name}</p>
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
                                                    statusConfig[invoice.status].color
                                                )}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {invoice.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
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
        </div>
    );
}
