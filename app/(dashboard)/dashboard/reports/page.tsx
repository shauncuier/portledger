'use client';

import { useState } from 'react';
import {
    BarChart3,
    PieChart as PieIcon,
    FileSpreadsheet,
    FileText,
    ArrowRight,
    ChevronRight,
    Download,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

const reportTypes = [
    {
        title: 'Profit & Loss Statement',
        description: 'Summary of revenues, costs, and expenses incurred during a specific period.',
        icon: BarChart3,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        type: 'profit-loss'
    },
    {
        title: 'Outstanding Receivables',
        description: 'Detailed list of all unpaid invoices and amounts owed by clients.',
        icon: PieIcon,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        type: 'outstanding'
    },
    {
        title: 'Client Statement',
        description: 'Transaction history and balance summary for a specific client.',
        icon: FileText,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        type: 'clients'
    },
    {
        title: 'Full Financial Export',
        description: 'Complete export of all invoices, income, and expenses.',
        icon: FileSpreadsheet,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        type: 'all'
    }
];

export default function ReportsPage() {
    const [selectedRange, setSelectedRange] = useState('This Month');
    const [exporting, setExporting] = useState<string | null>(null);

    const exportToExcel = async (type: string) => {
        setExporting(type);
        try {
            const res = await fetch(`/api/reports/export?type=${type}`, {
                credentials: 'include'
            });
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            if (!res.ok) {
                const errData = await res.json();
                console.error('Export API error:', errData);
                throw new Error(errData.error || 'Export failed');
            }
            const data = await res.json();

            const wb = XLSX.utils.book_new();

            if (data.clients) {
                const clientsSheet = XLSX.utils.json_to_sheet(data.clients.map((c: any) => ({
                    Name: c.name,
                    Company: c.company_name,
                    Email: c.email,
                    Phone: c.phone,
                    Address: c.address,
                    'Opening Balance': c.opening_balance,
                    Status: c.status
                })));
                XLSX.utils.book_append_sheet(wb, clientsSheet, 'Clients');
            }

            if (data.invoices) {
                const invoicesSheet = XLSX.utils.json_to_sheet(data.invoices.map((i: any) => ({
                    'Invoice #': i.invoice_number,
                    Client: i.client_id?.company_name || 'N/A',
                    Date: new Date(i.invoice_date).toLocaleDateString(),
                    'Due Date': new Date(i.due_date).toLocaleDateString(),
                    Total: i.total,
                    Paid: i.paid_amount,
                    Status: i.status
                })));
                XLSX.utils.book_append_sheet(wb, invoicesSheet, 'Invoices');
            }

            if (data.income) {
                const incomeSheet = XLSX.utils.json_to_sheet(data.income.map((i: any) => ({
                    Date: new Date(i.received_date).toLocaleDateString(),
                    'Invoice #': i.invoice_id?.invoice_number || 'N/A',
                    Client: i.client_id?.company_name || 'N/A',
                    Amount: i.amount,
                    Method: i.payment_method,
                    Reference: i.reference || ''
                })));
                XLSX.utils.book_append_sheet(wb, incomeSheet, 'Income');
            }

            if (data.expenses) {
                const expensesSheet = XLSX.utils.json_to_sheet(data.expenses.map((e: any) => ({
                    Date: new Date(e.expense_date).toLocaleDateString(),
                    Category: e.category,
                    Vendor: e.vendor_name,
                    Amount: e.amount,
                    Method: e.payment_method,
                    Note: e.note || ''
                })));
                XLSX.utils.book_append_sheet(wb, expensesSheet, 'Expenses');
            }

            if (data.summary) {
                const summarySheet = XLSX.utils.json_to_sheet([{
                    'Total Income': data.summary.totalIncome,
                    'Total Expenses': data.summary.totalExpense,
                    'Net Profit': data.summary.netProfit,
                    'Outstanding Receivables': data.summary.outstandingReceivables
                }]);
                XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
            }

            XLSX.writeFile(wb, `ClearLedger_Report_${type}_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
                    <p className="text-gray-500">Analyze your business performance with detailed insights.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-gray-200">
                    {['This Month', 'Last Month', 'This Year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setSelectedRange(range)}
                            className={cn(
                                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                                selectedRange === range
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report, i) => (
                    <div
                        key={i}
                        className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer"
                        onClick={() => exportToExcel(report.type)}
                    >
                        <div className="flex items-start justify-between">
                            <div className={cn('p-4 rounded-xl', report.bg)}>
                                <report.icon className={cn('h-8 w-8', report.color)} />
                            </div>
                            <div className="flex items-center space-x-2">
                                {exporting === report.type ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                                ) : (
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                        <Download className="h-5 w-5" />
                                    </button>
                                )}
                                <ChevronRight className="h-6 w-6 text-gray-300" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                {report.title}
                            </h3>
                            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                                {report.description}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                            <span>Download Report</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Summary Section */}
            <div className="bg-slate-900 rounded-3xl p-10 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h3 className="text-2xl font-bold mb-4">Export Full Data</h3>
                        <p className="text-slate-400">
                            Need a complete snapshot of your financial records? Export all data to Excel for external auditing or processing.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => exportToExcel('all')}
                            disabled={exporting === 'all'}
                            className="flex items-center space-x-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg disabled:opacity-50"
                        >
                            {exporting === 'all' ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="h-5 w-5" />
                            )}
                            <span>Export as Excel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
