'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    TrendingUp,
    Calendar,
    CreditCard,
    Building2,
    FileText,
    Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Income {
  ._id: string;
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
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchIncome();
    }, []);

    const fetchIncome = async () => {
        try {
            const res = await fetch('/api/income');
            const data = await res.json();
            setIncomeList(data);
        } catch (error) {
            console.error('Failed to fetch income records', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredIncome = incomeList.filter(inc =>
        inc.invoice_id.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.client_id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inc.client_id.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by invoice or client..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredIncome.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
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
                                                <p className="font-semibold text-gray-900 text-sm">{income.client_id.company_name}</p>
                                                <div className="flex items-center text-xs text-blue-600 font-bold">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    {income.invoice_id.invoice_number}
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
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end">
                                                <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                                                    <TrendingUp className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
