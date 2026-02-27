'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Bot,
  Shield,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingNav } from '@/components/landing/LandingNav';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { ROICalculator } from '@/components/landing/ROICalculator';

/* ─── Reusable fade-up wrapper ─── */
function FadeUp({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── How it works steps ─── */
const STEPS = [
  {
    num: '01',
    title: 'Add the widget to your site',
    desc: 'Paste one line of code. Your AI chat goes live in under 5 minutes.',
    color: 'text-emerald-400'
  },
  {
    num: '02',
    title: 'AI qualifies every lead',
    desc: 'GPT-4o-mini asks the right questions, captures contact details, and books appointments automatically.',
    color: 'text-violet-400'
  },
  {
    num: '03',
    title: 'You get paid, not interrupted',
    desc: 'SMS confirmations, calendar syncs, and reminders go out automatically. You just show up.',
    color: 'text-blue-400'
  }
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  {
    name: 'Dave Holt',
    trade: 'Plumber · Manchester',
    quote:
      "I was missing 3–4 jobs a week from missed calls. TradeBooking fixed that in the first week. Best £49 I spend every month."
  },
  {
    name: 'Sarah Briggs',
    trade: 'Electrician · Birmingham',
    quote:
      "The AI chat books jobs while I'm on site. I came home to 2 new bookings I didn't even know about."
  },
  {
    name: 'Mike Connell',
    trade: 'Roofer · Leeds',
    quote:
      "Setup took 20 minutes. Now every missed call gets a voicemail, a transcript, and an SMS to me. It's like having a receptionist."
  }
];

/* ─── Pricing features ─── */
const PRICING_FEATURES = [
  'AI website chat widget (GPT-4o-mini)',
  'Missed call capture & voicemail transcription',
  'Automatic SMS confirmations (Twilio)',
  '24-hour appointment reminders',
  'Google Calendar sync',
  'Built-in CRM & lead tracking',
  'Team members (up to 5)',
  'No setup fees · Cancel any time'
];

/* ─── Trust badges ─── */
const TRUST = [
  { icon: Bot, label: 'GPT-4o-mini AI' },
  { icon: Shield, label: 'GDPR compliant' },
  { icon: BarChart3, label: '99.9% uptime' },
  { icon: Zap, label: 'Live in 5 mins' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <LandingNav />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left — copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Built for UK trades
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl"
              >
                Your Trades Business{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent animate-gradient-x">
                  on Autopilot.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg"
              >
                TradeBooking gives plumbers, electricians, and roofers an AI assistant
                that qualifies leads, books appointments, and sends SMS confirmations —
                automatically, 24/7.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 gap-2 px-7"
                  >
                    Start free 14-day trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-sm text-slate-500">No credit card required</p>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                {TRUST.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-xs text-slate-400"
                  >
                    <Icon className="h-3.5 w-3.5 text-emerald-500" />
                    {label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — AI booking preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 blur-2xl scale-105 pointer-events-none" />

              <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-sm overflow-hidden shadow-2xl">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-800/60 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-3 text-xs text-slate-500">TradeBooking AI · Live chat</span>
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                {/* Chat messages */}
                <div className="p-5 space-y-3">
                  {[
                    { from: 'ai', text: "Hi! I'm the TradeBooking AI. What job do you need done?" },
                    { from: 'user', text: 'Need a boiler service, quite urgent' },
                    { from: 'ai', text: "Got it — boiler service. What area are you in?" },
                    { from: 'user', text: 'Sheffield, S10' },
                    { from: 'ai', text: "I have Thursday 9am or Friday 2pm available. Which works for you?" },
                    { from: 'user', text: 'Thursday 9am please' },
                    { from: 'ai', text: "Booked ✓ You'll get an SMS confirmation shortly." },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.12, duration: 0.35 }}
                      className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                          msg.from === 'user'
                            ? 'bg-slate-700 text-slate-200 rounded-br-sm'
                            : 'bg-emerald-500/20 border border-emerald-500/25 text-emerald-100 rounded-bl-sm'
                        }`}
                      >
                        {msg.from === 'ai' && (
                          <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-0.5">
                            AI Assistant
                          </p>
                        )}
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Booked confirmation banner */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.4 }}
                  className="mx-5 mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-300">Appointment booked</p>
                    <p className="text-[11px] text-slate-400">Thu 9am · Boiler service · Sheffield S10 · SMS sent</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BENTO GRID
      ══════════════════════════════════════ */}
      <BentoGrid />

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-900/50">
        <div className="mx-auto max-w-4xl">
          <FadeUp className="text-center mb-14">
            <span className="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">
              How it works
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Up and running in 20 minutes
            </h2>
          </FadeUp>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-500/40 via-violet-500/40 to-blue-500/40 hidden md:block" />

            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.15}>
                  <div className="flex gap-6 items-start">
                    <div className={`flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 text-2xl font-extrabold ${step.color}`}>
                      {step.num}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ROI CALCULATOR
      ══════════════════════════════════════ */}
      <ROICalculator />

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Trusted by UK tradespeople
            </h2>
            <p className="mt-3 text-slate-400">Real results from real businesses.</p>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="rounded-3xl border border-white/10 bg-slate-800/60 p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.trade}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-4">
        <div className="mx-auto max-w-lg">
          <FadeUp className="text-center mb-12">
            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
              Pricing
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Simple, honest pricing</h2>
            <p className="mt-3 text-slate-400">One plan. Everything included. No surprises.</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="relative rounded-3xl border-2 border-emerald-500/50 bg-slate-900 p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
                    TradeBooking Pro
                  </p>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs text-emerald-400 font-medium">
                    Most popular
                  </span>
                </div>

                <div className="flex items-end gap-1 mt-4">
                  <span className="text-6xl font-extrabold text-white">£49</span>
                  <span className="mb-2 text-slate-400">/month</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">14-day free trial · Cancel any time</p>

                <ul className="mt-8 space-y-3">
                  {PRICING_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="mt-8 block">
                  <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/30 gap-2"
                    size="lg"
                  >
                    Start free trial
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="py-24 px-4">
        <FadeUp>
          <div className="mx-auto max-w-3xl text-center rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to stop missing jobs?
              </h2>
              <p className="mt-4 text-slate-400 max-w-md mx-auto">
                Join tradespeople across the UK who use TradeBooking to win more work
                without working more hours.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 gap-2 px-8"
                  >
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-slate-300 hover:bg-white/10"
                  >
                    Sign in to dashboard
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-slate-500">No credit card required · 14-day free trial</p>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">
              Trade<span className="text-emerald-400">Booking</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TradeBooking · tradebooking.co.uk
          </p>
          <div className="flex gap-5 text-xs text-slate-500">
            <span className="cursor-pointer hover:text-slate-300 transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-slate-300 transition-colors">Terms</span>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
