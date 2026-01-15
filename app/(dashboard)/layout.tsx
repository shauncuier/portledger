'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    LayoutDashboard,
    Users,
    FileText,
    TrendingDown,
    TrendingUp,
    BarChart3,
    LogOut,
    ChevronRight,
    Menu,
    X,
    UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Income', href: '/dashboard/income', icon: TrendingUp },
    { name: 'Expenses', href: '/dashboard/expenses', icon: TrendingDown },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    'bg-slate-900 text-white transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-50 md:relative',
                    isSidebarOpen ? 'w-64' : 'w-20'
                )}
            >
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
                        <span
                            className={cn(
                                'font-bold text-xl text-blue-400 transition-opacity',
                                !isSidebarOpen && 'opacity-0 md:hidden'
                            )}
                        >
                            ClearLedger
                        </span>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative',
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    <item.icon className={cn('h-5 w-5 min-w-[20px]', isActive ? 'text-white' : 'group-hover:text-blue-400')} />
                                    <span
                                        className={cn(
                                            'ml-3 font-medium transition-opacity',
                                            !isSidebarOpen && 'opacity-0 md:hidden'
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                    {!isSidebarOpen && (
                                        <div className="hidden md:group-hover:block absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-sm rounded-md whitespace-nowrap z-50">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center mb-4 px-2">
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                <UserCircle className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className={cn('ml-3', !isSidebarOpen && 'hidden')}>
                                <p className="text-sm font-semibold truncate w-32">{session?.user?.name || 'User'}</p>
                                <p className="text-xs text-slate-500 capitalize">{session?.user?.role || 'Staff'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className={cn(
                                'w-full flex items-center px-3 py-3 rounded-xl text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200',
                                !isSidebarOpen && 'justify-center'
                            )}
                        >
                            <LogOut className="h-5 w-5" />
                            <span className={cn('ml-3 font-medium', !isSidebarOpen && 'hidden')}> Logout </span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-gray-800 capitalize">
                        {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                            <p className="text-xs text-gray-500">{session?.user?.email}</p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
