import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Lock
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Header */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
              <Image
                src="/logo.png"
                alt="ClearLedger Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ClearLedger</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <Link
              href="/login"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Simplified Hero Section */}
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="animate-fadeIn">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Enterprise Finance OS</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
                  Manage your <br />
                  <span className="text-indigo-600">logistics finances</span> <br />
                  with confidence.
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-lg mb-10">
                  The modern financial dashboard for C&F agents. Automate invoicing, track expenses, and view real-time profitability in one clean interface.
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#features"
                    className="w-full sm:w-auto text-center px-8 py-4 text-slate-600 font-bold hover:text-slate-900 transition-all"
                  >
                    Explore features
                  </a>
                </div>
              </div>

              <div className="relative animate-fadeIn">
                <div className="bg-slate-50 rounded-[40px] p-4 lg:p-8">
                  <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl border border-slate-100 bg-white">
                    <Image
                      src="/banner.png"
                      alt="Financial Dashboard"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-indigo-900/5" />
                  </div>

                  {/* Subtle Overlay Badge */}
                  <div className="absolute -bottom-6 -right-6 hidden lg:block">
                    <div className="bg-white p-5 rounded-[24px] shadow-xl border border-slate-50 flex items-center space-x-4">
                      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">System Healthy</p>
                        <p className="text-xs text-slate-400">All data synced</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simplified Features Section */}
        <section id="features" className="py-24 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  title: "Smart Invoicing",
                  desc: "Create professional invoices in seconds with automated tax calculations.",
                  icon: BarChart3
                },
                {
                  title: "Operations",
                  desc: "Full CRUD for income and expenses with linked financial records.",
                  icon: Zap
                },
                {
                  title: "Cloud Secure",
                  desc: "Bank-grade encryption for all your financial and client data.",
                  icon: Lock
                }
              ].map((feature, i) => (
                <div key={i} className="group">
                  <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-100">
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Stats Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto text-center border-t border-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-12">Trusted Security & Performance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">99.9%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Uptime Guarantee</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">256-bit</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AES Encryption</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">$2M+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Cleared Volume</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900">1.2ms</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Response Time</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 bg-white border-t border-slate-50 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-50 grayscale" />
            <span>© 2026 ClearLedger Inc.</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
