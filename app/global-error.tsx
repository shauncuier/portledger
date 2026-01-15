'use client';

import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center relative overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
                        {/* Critical Error Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-red-500/40 animate-pulse">
                                <AlertOctagon className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        {/* Message */}
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            Critical Error
                        </h1>
                        <p className="text-lg text-white/50 mb-8 leading-relaxed">
                            A critical error occurred in the application. Please try refreshing the page.
                        </p>

                        {/* Error Digest */}
                        {error?.digest && (
                            <p className="text-xs text-white/30 mb-6">
                                Error ID: {error.digest}
                            </p>
                        )}

                        {/* Reset Button */}
                        <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-white font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-red-500/25"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Refresh Page
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
