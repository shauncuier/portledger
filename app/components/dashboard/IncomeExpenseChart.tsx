'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
} from 'recharts';

interface IncomeExpenseChartProps {
    data: {
        month: string;
        income: number;
        expense: number;
        profit: number;
    }[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    }}
                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                        paddingBottom: '20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#64748b'
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                    animationDuration={1500}
                />
                <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#e11d48"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    name="Expense"
                    animationDuration={1500}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
