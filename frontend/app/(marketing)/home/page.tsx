'use client';

import Link from 'next/link';
import {
  Zap,
  MessageSquare,
  Phone,
  CalendarDays,
  Users,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Website Chat',
    description:
      'Your AI assistant qualifies leads 24/7 — captures name, job type, location, and urgency before you even pick up the phone.'
  },
  {
    icon: Phone,
    title: 'Missed Call Capture',
    description:
      'Never lose a job to voicemail again. When you miss a call, our AI takes a message, transcribes it, and alerts you instantly.'
  },
  {
    icon: CalendarDays,
    title: 'Instant Booking',
    description:
      'Leads can book directly from the chat. Appointments sync to Google Calendar and SMS confirmations go out automatically.'
  },
  {
    icon: Users,
    title: 'Built-in CRM',
    description:
      'Every lead, conversation, and appointment in one place. See the full history of every customer at a glance.'
  },
  {
    icon: Zap,
    title: 'SMS Automation',
    description:
      'Appointment confirmations, 24-hour reminders, and follow-ups — all sent automatically so you never have to think about it.'
  },
  {
    icon: CreditCard,
    title: 'Simple Pricing',
    description:
      'One flat monthly fee. No per-message charges, no hidden costs. Cancel any time.'
  }
];

const TESTIMONIALS = [
  {
    name: 'Dave Holt',
    trade: 'Plumber, Manchester',
    quote:
      "I was missing 3–4 jobs a week just from missed calls. TradeBooking fixed that in the first week. Best £49 I spend every month."
  },
  {
    name: 'Sarah Briggs',
    trade: 'Electrician, Birmingham',
    quote:
      "The AI chat on my website books jobs while I'm on site. I came home to 2 new bookings I didn't even know about."
  },
  {
    name: 'Mike Connell',
    trade: 'Roofer, Leeds',
    quote:
      "Setup took 20 minutes. Now every missed call gets a voicemail, a transcript, and an SMS to me. It's like having a receptionist."
  }
];

const PRICING = [
  { label: 'AI website chat widget', included: true },
  { label: 'Missed call capture & voicemail', included: true },
  { label: 'Automatic SMS confirmations', included: true },
  { label: '24-hour appointment reminders', included: true },
  { label: 'Google Calendar sync', included: true },
  { label: 'Built-in CRM & lead tracking', included: true },
  { label: 'Team members (up to 5)', included: true },
  { label: 'No setup fees', included: true }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TradeBooking</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start free trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
          Built for UK trades
        </Badge>
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Never miss another{' '}
          <span className="text-blue-600">job</span> again
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
          TradeBooking gives plumbers, electricians, and roofers an AI assistant that
          answers enquiries, captures missed calls, books appointments, and sends SMS
          confirmations — automatically, 24/7.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/register">
            <Button size="lg" className="gap-2 px-8">
              Start your free 14-day trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-slate-400">No credit card required</p>
        </div>

        {/* Hero visual */}
        <div className="mt-16 overflow-hidden rounded-2xl border shadow-2xl">
          <div className="flex items-center gap-1.5 bg-slate-100 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-slate-400">app.tradebooking.co.uk/dashboard</span>
          </div>
          <div className="bg-slate-50 p-6 text-left">
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: 'New leads today', value: '4', color: 'text-purple-600' },
                { label: 'Upcoming appointments', value: '7', color: 'text-green-600' },
                { label: 'AI conversations', value: '23', color: 'text-blue-600' },
                { label: 'Missed calls captured', value: '2', color: 'text-orange-600' }
              ].map((s) => (
                <div key={s.label} className="rounded-xl border bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need to win more jobs</h2>
            <p className="mt-3 text-slate-500">
              One platform that handles your enquiries, bookings, and follow-ups.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12">
            Trusted by UK tradespeople
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.trade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <h2 className="text-3xl font-bold">Simple, honest pricing</h2>
          <p className="mt-3 text-slate-500">One plan. Everything included.</p>

          <div className="mt-10 rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              TradeBooking Pro
            </p>
            <div className="mt-4 flex items-end justify-center gap-1">
              <span className="text-5xl font-extrabold">£49</span>
              <span className="mb-1 text-slate-400">/month</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              14-day free trial · Cancel any time
            </p>

            <ul className="mt-8 space-y-3 text-left">
              {PRICING.map(({ label, included }) => (
                <li key={label} className="flex items-center gap-3 text-sm">
                  <CheckCircle
                    className={`h-4 w-4 shrink-0 ${included ? 'text-green-500' : 'text-slate-300'}`}
                  />
                  <span className={included ? 'text-slate-700' : 'text-slate-400 line-through'}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/register" className="mt-8 block">
              <Button className="w-full" size="lg">
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold">
            Ready to stop missing jobs?
          </h2>
          <p className="mt-4 text-slate-500">
            Join tradespeople across the UK who use TradeBooking to win more work
            without working more hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-slate-700">TradeBooking</span>
        </div>
        <p>© {new Date().getFullYear()} TradeBooking · tradebooking.co.uk</p>
      </footer>
    </div>
  );
}
