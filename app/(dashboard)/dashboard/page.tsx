import { Suspense } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    Download,
    Plus,
    Loader2
} from 'lucide-react';
import { ReportService } from '@/services/report.service';
import { formatCurrency } from '@/lib/utils';
import IncomeExpenseChart from '@/app/components/dashboard/IncomeExpenseChart';

async function DashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const pl = await ReportService.getProfitLoss(startOfMonth, endOfMonth);
    const chartData = await ReportService.getMonthlyIncomeExpense(now.getFullYear());
    const outstanding = await ReportService.getOutstandingReceivables();
    const totalOutstanding = outstanding.reduce((acc, curr) => acc + curr.total_due, 0);

    const stats = [
        {
            title: 'Total Income',
            subtitle: 'This Month',
            value: formatCurrency(pl.income),
            icon: TrendingUp,
            gradient: 'from-emerald-500 to-teal-600',
            shadowColor: 'shadow-emerald-200',
            trend: '+12.5%',
            trendUp: true
        },
        {
            title: 'Total Expense',
            subtitle: 'This Month',
            value: formatCurrency(pl.expense),
            icon: TrendingDown,
            gradient: 'from-rose-500 to-pink-600',
            shadowColor: 'shadow-rose-200',
            trend: '+4.2%',
            trendUp: false
        },
        {
            title: 'Net Profit',
            subtitle: 'This Month',
            value: formatCurrency(pl.netProfit),
            icon: DollarSign,
            gradient: 'from-indigo-500 to-purple-600',
            shadowColor: 'shadow-indigo-200',
            trend: '+18.7%',
            trendUp: true
        },
        {
            title: 'Outstanding',
            subtitle: 'Receivables',
            value: formatCurrency(totalOutstanding),
            icon: Clock,
            gradient: 'from-amber-500 to-orange-600',
            shadowColor: 'shadow-amber-200',
            trend: '-2.1%',
            trendUp: true
        }
    ];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-lg ${stat.shadowColor} card-hover`}
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-200' : 'text-rose-200'} bg-white/10 px-2 py-1 rounded-full`}>
                                    <span>{stat.trend}</span>
                                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-white/70 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                <p className="text-xs text-white/50 mt-1">{stat.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Income vs Expense</h3>
                            <p className="text-sm text-slate-500">Monthly breakdown for {now.getFullYear()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="flex items-center text-sm text-slate-500">
                                <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2" />
                                Income
                            </span>
                            <span className="flex items-center text-sm text-slate-500">
                                <span className="w-3 h-3 bg-rose-500 rounded-full mr-2" />
                                Expense
                            </span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <IncomeExpenseChart data={chartData} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Outstanding Dues</h3>
                        <Link href="/dashboard/invoices" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {outstanding.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {item.company_name?.charAt(0) || '?'}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-slate-800">{item.company_name}</p>
                                        <p className="text-xs text-slate-500">{item.invoice_count} invoices pending</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-rose-600">{formatCurrency(item.total_due)}</p>
                            </div>
                        ))}
                        {outstanding.length === 0 && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                                </div>
                                <p className="text-sm text-slate-500">All caught up! No outstanding dues.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-200 h-40 rounded-2xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-200 h-[450px] rounded-2xl" />
                <div className="bg-slate-200 h-[450px] rounded-2xl" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome back! 👋</h2>
                    <p className="text-slate-500">Here's what's happening with your business today.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/dashboard/reports"
                        className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </Link>
                    <Link
                        href="/dashboard/invoices"
                        className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New Invoice</span>
                    </Link>
                </div>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
                <DashboardStats />
            </Suspense>
        </div>
    );
}
