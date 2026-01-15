'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    TrendingUp,
    Calendar,
    CreditCard,
    FileText,
    Loader2,
    X,
    Save
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Invoice {
    _id: string;
    invoice_number: string;
    total: number;
    paid_amount: number;
    client_id: {
        _id: string;
        name: string;
        company_name: string;
    };
}

interface Income {
    _id: string;
    invoice_id: {
        _id: string;
        invoice_number: string;
    };
    client_id: {
        _id: string;
        name: string;
        company_name: string;
    };
    amount: number;
    payment_method: string;
    received_date: string;
    reference: string;
}

export default function IncomePage() {
    const [incomeList, setIncomeList] = useState<Income[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        invoice_id: '',
        amount: 0,
        payment_method: 'cash',
        received_date: new Date().toISOString().split('T')[0],
        reference: '',
    });

    useEffect(() => {
        fetchIncome();
        fetchInvoices();
    }, []);

    const fetchIncome = async () => {
        try {
            const res = await fetch('/api/income', { credentials: 'include' });
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const data = await res.json();
            setIncomeList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch income records', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/invoices', { credentials: 'include' });
            const data = await res.json();
            // Only show unpaid or partial invoices
            const unpaid = (Array.isArray(data) ? data : []).filter(
                (inv: Invoice) => inv.total > inv.paid_amount
            );
            setInvoices(unpaid);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
        }
    };

    const openCreateModal = () => {
        setFormData({
            invoice_id: '',
            amount: 0,
            payment_method: 'cash',
            received_date: new Date().toISOString().split('T')[0],
            reference: '',
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

        try {
            const res = await fetch('/api/income', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to record payment');
            }

            await fetchIncome();
            await fetchInvoices();
            closeModal();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const selectedInvoice = invoices.find(inv => inv._id === formData.invoice_id);
    const maxPayment = selectedInvoice ? selectedInvoice.total - selectedInvoice.paid_amount : 0;

    const filteredIncome = incomeList.filter(inc =>
        inc.invoice_id?.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.client_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.client_id?.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by invoice or client..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>Record Payment</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredIncome.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        No income records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredIncome.map((income) => (
                                    <tr key={income._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm font-medium text-gray-900">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                {formatDate(income.received_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-gray-900 text-sm">{income.client_id?.company_name || 'N/A'}</p>
                                                <div className="flex items-center text-xs text-blue-600 font-bold">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    {income.invoice_id?.invoice_number || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs text-gray-600 font-medium uppercase">
                                                    <CreditCard className="h-3 w-3 mr-2" />
                                                    {income.payment_method}
                                                </div>
                                                {income.reference && (
                                                    <p className="text-xs text-gray-400">Ref: {income.reference}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-bold text-emerald-600">
                                                {formatCurrency(income.amount)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
                                <select
                                    required
                                    value={formData.invoice_id}
                                    onChange={(e) => setFormData({ ...formData, invoice_id: e.target.value, amount: 0 })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select Invoice</option>
                                    {invoices.map((inv) => (
                                        <option key={inv._id} value={inv._id}>
                                            {inv.invoice_number} - {inv.client_id?.company_name} (Due: {formatCurrency(inv.total - inv.paid_amount)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedInvoice && (
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <p>Total: <strong>{formatCurrency(selectedInvoice.total)}</strong></p>
                                    <p>Paid: <strong>{formatCurrency(selectedInvoice.paid_amount)}</strong></p>
                                    <p className="text-emerald-600 font-bold">Remaining: {formatCurrency(maxPayment)}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    min="0.01"
                                    max={maxPayment || undefined}
                                    step="0.01"
                                    required
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                    <select
                                        value={formData.payment_method}
                                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="mobile">Mobile Payment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.received_date}
                                        onChange={(e) => setFormData({ ...formData, received_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Transaction ID, check number, etc."
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
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
                                    className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    <span>{saving ? 'Recording...' : 'Record Payment'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
