'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[180px] sm:text-[220px] font-bold leading-none bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-transparent select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse">
                            <Search className="w-10 h-10 text-white" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-white/50 mb-10 max-w-md mx-auto leading-relaxed">
                    Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full text-white font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    <p className="text-sm text-white/40 mb-4">Perhaps you were looking for:</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Clients', href: '/dashboard/clients' },
                            { name: 'Invoices', href: '/dashboard/invoices' },
                            { name: 'Settings', href: '/dashboard/settings' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
