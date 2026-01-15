import Link from 'next/link';
import { ShieldCheck, BarChart3, Users, Zap, ArrowRight, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selección:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">ClearLedger</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
            <Link
              href="/login"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="h-4 w-4" />
              <span>Production Ready Financial System</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Manage C&F <br />
              <span className="text-blue-600">Finances</span> with <br />
              Precision.
            </h1>
            <p className="mt-8 text-xl text-slate-500 leading-relaxed max-w-lg">
              The all-in-one financial management system designed specifically for clearing and forwarding agents. Real-time reports, automated invoicing, and secure accounting.
            </p>
            <div className="mt-10 flex items-center space-x-6">
              <Link
                href="/login"
                className="group flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden shadow-slate-200">
              <div className="aspect-[4/3] bg-slate-50 flex items-center justify-center">
                <BarChart3 className="h-32 w-32 text-blue-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-bold">Comprehensive Modules</h2>
          <p className="mt-4 text-slate-500 text-lg">Everything you need to run your C&F business efficiently.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Invoicing",
              desc: "Automated invoice generation with professional templates and status tracking.",
              icon: FileText
            },
            {
              title: "Operations",
              desc: "Manage income and expenses with multi-method payment support and linked records.",
              icon: Zap
            },
            {
              title: "Analytics",
              desc: "Advanced MongoDB-powered reporting for Profit & Loss, Dues, and Trends.",
              icon: BarChart3
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-white shadow-sm hover:shadow-xl transition-all">
              <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <feature.icon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
