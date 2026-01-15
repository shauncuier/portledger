'use client';

import { useState } from 'react';
import {
    BarChart3,
    PieChart as PieIcon,
    FileSpreadsheet,
    FileText,
    Calendar,
    ArrowRight,
    ChevronRight,
    Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

const reportTypes = [
    {
        title: 'Profit & Loss Statement',
        description: 'Summary of revenues, costs, and expenses incurred during a specific period.',
        icon: BarChart3,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Outstanding Receivables',
        description: 'Detailed list of all unpaid invoices and amounts owed by clients.',
        icon: PieIcon,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        title: 'Client Statement',
        description: 'Transaction history and balance summary for a specific client.',
        icon: FileText,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        title: 'Tax/VAT Summary',
        description: 'Overview of tax collected on invoices and tax paid on expenses.',
        icon: FileSpreadsheet,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    }
];

export default function ReportsPage() {
    const [selectedRange, setSelectedRange] = useState('This Month');

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
                    <div key={i} className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div className={cn('p-4 rounded-xl', report.bg)}>
                                <report.icon className={cn('h-8 w-8', report.color)} />
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                    <Download className="h-5 w-5" />
                                </button>
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
                            <span>Generate Report</span>
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
                        <button className="flex items-center space-x-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                            <FileSpreadsheet className="h-5 w-5" />
                            <span>Export as Excel</span>
                        </button>
                        <button className="flex items-center space-x-2 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all border border-slate-700">
                            <FileText className="h-5 w-5" />
                            <span>Export as PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
