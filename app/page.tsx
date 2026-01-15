'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle,
  BarChart2,
  FileText,
  Users,
  Wallet,
  Shield,
  Clock,
  Globe,
  Sparkles,
  ChevronDown,
  Play,
  Layers,
  PieChart,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white antialiased">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Image src="/logo.png" alt="ClearLedger" width={28} height={28} className="rounded" />
              </div>
              <span className="text-xl font-bold tracking-tight">ClearLedger</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-8 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-white/70">Introducing ClearLedger 2.0</span>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium">New</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8 animate-fadeIn">
                Financial clarity for
                <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  modern logistics
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed animate-fadeIn">
                Streamline invoicing, track expenses, and gain real-time insights into your C&F operations. All in one powerful, intuitive platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeIn">
                <Link
                  href="/login"
                  className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full text-white font-semibold text-base hover:opacity-90 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  Start for free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-semibold text-base transition-all flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch demo
                </button>
              </div>

              {/* Scroll indicator */}
              <div className="animate-bounce">
                <ChevronDown className="w-6 h-6 text-white/30 mx-auto" />
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="mt-20 relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-[40px] blur-3xl opacity-60" />

              <div className="relative bg-gradient-to-b from-white/10 to-white/5 rounded-[32px] p-2 border border-white/10 shadow-2xl">
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[2.5/1] rounded-[24px] overflow-hidden bg-[#12121a]">
                  <Image
                    src="/banner.png"
                    alt="ClearLedger Dashboard"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 lg:-left-12 top-1/4 animate-float hidden lg:block">
                <div className="bg-[#16161f] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Revenue</p>
                      <p className="text-lg font-bold text-emerald-400">+32.5%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 lg:-right-12 top-1/3 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
                <div className="bg-[#16161f] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50">Invoices</p>
                      <p className="text-lg font-bold">128 sent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-16 px-6 lg:px-8 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-sm text-white/40 mb-8 uppercase tracking-widest">Trusted by leading logistics companies</p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
              {['FastTrack', 'GlobalFreight', 'SwiftShip', 'CargoMax', 'TransWorld'].map((name, i) => (
                <div key={i} className="text-xl font-bold text-white/60">{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 lg:py-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-indigo-400 font-medium text-sm uppercase tracking-widest mb-4">Features</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Everything you need to
                <span className="block text-white/50">manage your finances</span>
              </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Large Card */}
              <div className="lg:col-span-2 group relative p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-white/5 hover:border-indigo-500/30 transition-all overflow-hidden">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                    <BarChart2 className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Real-time Analytics</h3>
                  <p className="text-white/50 max-w-md leading-relaxed">Get instant insights with live dashboards. Track revenue, expenses, and profitability as transactions happen.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tl from-indigo-500/10 to-transparent rounded-tl-[100px] group-hover:from-indigo-500/20 transition-all" />
              </div>

              {/* Regular Cards */}
              {[
                { icon: FileText, title: 'Smart Invoicing', desc: 'Generate professional invoices with automated tax calculations.', color: 'violet' },
                { icon: Wallet, title: 'Expense Tracking', desc: 'Categorize and monitor every expense in real-time.', color: 'cyan' },
                { icon: Users, title: 'Client Portal', desc: 'Dedicated portals for each client with transaction history.', color: 'emerald' },
                { icon: Layers, title: 'Multi-Currency', desc: 'Handle transactions in any currency with live rates.', color: 'amber' },
                { icon: Shield, title: 'Bank-Grade Security', desc: '256-bit encryption and SOC 2 Type II compliant.', color: 'rose' },
              ].map((feature, i) => (
                <div key={i} className={`group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-${feature.color}-500/30 hover:bg-white/[0.04] transition-all`}>
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-5`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 lg:py-32 px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <p className="text-indigo-400 font-medium text-sm uppercase tracking-widest mb-4">How it works</p>
              <h2 className="text-4xl lg:text-5xl font-bold">
                Get started in
                <span className="text-white/50"> 3 simple steps</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Connect Your Business', desc: 'Sign up and connect your bank accounts and business tools in minutes.' },
                { step: '02', title: 'Import Your Data', desc: 'Automatically import clients, invoices, and transaction history.' },
                { step: '03', title: 'Start Managing', desc: 'Use powerful tools to invoices, track expenses, and grow your business.' },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="text-7xl font-bold text-white/5 group-hover:text-indigo-500/10 transition-colors absolute -top-4 -left-2">{item.step}</div>
                  <div className="relative pt-12">
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-6 h-6 text-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '99.9%', label: 'Uptime' },
                { value: '500+', label: 'Companies' },
                { value: '$50M+', label: 'Processed' },
                { value: '<100ms', label: 'Response' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">{stat.value}</p>
                  <p className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 lg:py-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-400 font-medium text-sm uppercase tracking-widest mb-4">Pricing</p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-white/50">No hidden fees. Cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Starter', price: 'Free', desc: 'For individuals getting started', features: ['5 clients', '10 invoices/mo', 'Basic reports', 'Email support'] },
                { name: 'Pro', price: '$29', desc: 'For growing businesses', features: ['Unlimited clients', 'Unlimited invoices', 'Advanced analytics', 'Priority support', 'API access'], popular: true },
                { name: 'Enterprise', price: 'Custom', desc: 'For large organizations', features: ['Everything in Pro', 'Custom integrations', 'Dedicated manager', 'SLA guarantee', 'On-premise option'] },
              ].map((plan, i) => (
                <div key={i} className={`relative p-8 rounded-3xl border transition-all ${plan.popular ? 'bg-gradient-to-b from-indigo-500/10 to-violet-500/5 border-indigo-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-semibold">
                      Most popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{plan.desc}</p>
                  <p className="text-4xl font-bold mb-6">
                    {plan.price}
                    {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-lg text-white/40 font-normal">/mo</span>}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/login"
                    className={`block w-full py-3 rounded-xl text-center font-semibold text-sm transition-all ${plan.popular ? 'bg-white text-black hover:bg-white/90' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                  >
                    Get started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-[60px] blur-3xl" />
            <div className="relative bg-gradient-to-b from-white/5 to-white/[0.02] rounded-[40px] p-12 lg:p-20 border border-white/10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to take control of
                <span className="block text-indigo-400">your finances?</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Join hundreds of logistics professionals who have simplified their financial operations.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-black rounded-full font-semibold text-base hover:bg-white/90 transition-all hover:scale-105 shadow-xl"
              >
                Start your free trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-white/30 mt-6">No credit card required · Free 14-day trial</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Image src="/logo.png" alt="ClearLedger" width={20} height={20} className="rounded" />
              </div>
              <span className="text-sm text-white/40">© 2026 ClearLedger. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
