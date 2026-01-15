'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
    LayoutDashboard,
    Users,
    FileText,
    TrendingDown,
    TrendingUp,
    BarChart3,
    LogOut,
    Menu,
    X,
    UserCircle,
    Bell,
    Settings,
    ChevronDown,
    UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Income', href: '/dashboard/income', icon: TrendingUp },
    { name: 'Expenses', href: '/dashboard/expenses', icon: TrendingDown },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Users', href: '/dashboard/users', icon: UserCog, ownerOnly: true },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out md:relative',
                    isSidebarOpen ? 'w-72' : 'w-20'
                )}
                style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)' }}
            >
                <div className="h-full flex flex-col text-white">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                        <div className={cn('flex items-center', !isSidebarOpen && 'justify-center w-full')}>
                            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/30">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span
                                className={cn(
                                    'ml-3 font-bold text-xl tracking-tight transition-opacity',
                                    !isSidebarOpen && 'opacity-0 hidden'
                                )}
                            >
                                ClearLedger
                            </span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={cn(
                                'p-2 rounded-lg hover:bg-white/10 transition-colors',
                                !isSidebarOpen && 'hidden'
                            )}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="w-full p-3 rounded-xl hover:bg-white/10 transition-colors flex justify-center mb-4"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        )}
                        {sidebarItems
                            .filter((item) =>
                                !item.ownerOnly ||
                                (
                                    session &&
                                    session.user &&
                                    'role' in session.user &&
                                    (session.user as { role?: string }).role === 'owner'
                                )
                            )
                            .map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative',
                                            isActive
                                                ? 'bg-white text-indigo-900 shadow-lg shadow-indigo-900/20'
                                                : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                                        )}
                                    >
                                        <item.icon className={cn(
                                            'h-5 w-5 min-w-[20px]',
                                            isActive ? 'text-indigo-600' : 'group-hover:text-white'
                                        )} />
                                        <span
                                            className={cn(
                                                'ml-3 font-medium transition-opacity',
                                                !isSidebarOpen && 'opacity-0 hidden'
                                            )}
                                        >
                                            {item.name}
                                        </span>
                                        {isActive && (
                                            <div className="absolute right-3 w-2 h-2 rounded-full bg-indigo-500" />
                                        )}
                                        {!isSidebarOpen && (
                                            <div className="hidden md:group-hover:block absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl">
                                                {item.name}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-white/10">
                        <div className={cn(
                            'flex items-center p-3 rounded-xl bg-white/5',
                            !isSidebarOpen && 'justify-center'
                        )}>
                            <div className="h-10 w-10 rounded-full overflow-hidden shadow-lg border border-white/20">
                                <Image
                                    src="/avatar.png"
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className={cn('ml-3 flex-1', !isSidebarOpen && 'hidden')}>
                                <p className="text-sm font-semibold truncate">{session?.user?.name || 'User'}</p>
                                <p className="text-xs text-indigo-300 capitalize">{session && session.user && 'role' in session.user ? (session.user as { role?: string }).role || 'Staff' : 'Staff'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className={cn(
                                'w-full mt-3 flex items-center px-4 py-3 rounded-xl text-indigo-200 hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200',
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
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 capitalize">
                            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                        </button>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="h-10 w-10 rounded-full overflow-hidden shadow-lg shadow-indigo-200 border border-slate-200">
                                    <Image
                                        src="/avatar.png"
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-800">{session?.user?.name}</p>
                                    <p className="text-xs text-slate-500">{session?.user?.email}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-fadeIn">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-800">{session?.user?.name}</p>
                                        <p className="text-xs text-slate-500">{session?.user?.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard/settings"
                                        className="w-full px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Settings className="h-4 w-4 mr-3" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            )}
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
