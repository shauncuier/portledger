import { Suspense } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Clock,
    ArrowUpRight,
    ArrowDownRight
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
            title: 'Total Income (Month)',
            value: formatCurrency(pl.income),
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+12.5%', // Mock trend for design
            trendUp: true
        },
        {
            title: 'Total Expense (Month)',
            value: formatCurrency(pl.expense),
            icon: TrendingDown,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            trend: '+4.2%',
            trendUp: false
        },
        {
            title: 'Net Profit (Month)',
            value: formatCurrency(pl.netProfit),
            icon: DollarSign,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+18.7%',
            trendUp: true
        },
        {
            title: 'Outstanding Dues',
            value: formatCurrency(totalOutstanding),
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '-2.1%',
            trendUp: true
        }
    ];

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-xl`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center space-x-1 text-sm font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>{stat.trend}</span>
                                {stat.trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Income vs Expense</h3>
                            <p className="text-sm text-gray-500">Monthly breakdown for {now.getFullYear()}</p>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <IncomeExpenseChart data={chartData} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Outstanding Dues</h3>
                    <div className="space-y-6">
                        {outstanding.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{item.company_name}</p>
                                    <p className="text-xs text-gray-500">{item.invoice_count} pending invoices</p>
                                </div>
                                <p className="text-sm font-bold text-rose-600">{formatCurrency(item.total_due)}</p>
                            </div>
                        ))}
                        {outstanding.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No outstanding dues</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
                    <p className="text-gray-500">Welcome back to your ClearLedger dashboard.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                        Create Invoice
                    </button>
                </div>
            </div>

            <Suspense fallback={<div>Loading dashboard data...</div>}>
                <DashboardStats />
            </Suspense>
        </div>
    );
}
