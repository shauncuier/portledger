'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
                {/* Error Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center border border-rose-500/30">
                            <AlertTriangle className="w-14 h-14 text-rose-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center animate-pulse">
                            <Bug className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Something went wrong!
                </h1>
                <p className="text-lg text-white/50 mb-4 max-w-md mx-auto leading-relaxed">
                    We encountered an unexpected error. Don't worry, our team has been notified and is working on it.
                </p>

                {/* Error Details (only in dev) */}
                {process.env.NODE_ENV === 'development' && error?.message && (
                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left">
                        <p className="text-xs text-rose-400/70 uppercase tracking-wider mb-2">Error Details</p>
                        <code className="text-sm text-rose-300 break-all">
                            {error.message}
                        </code>
                        {error.digest && (
                            <p className="text-xs text-white/30 mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                    <button
                        onClick={reset}
                        className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-600 to-orange-600 rounded-full text-white font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                </div>

                {/* Support Info */}
                <div className="pt-8 border-t border-white/10">
                    <p className="text-sm text-white/40 mb-2">Need help?</p>
                    <p className="text-sm text-white/60">
                        Contact support at{' '}
                        <a href="mailto:support@clearledger.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            support@clearledger.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
