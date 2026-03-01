'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Phone, Clock, Users } from 'lucide-react';

const TRADE_TYPES = ['Plumbing', 'Electrical', 'Roofing', 'Building / General Contracting', 'HVAC / Heating', 'Drainage', 'Landscaping', 'Other'];
const STAFF_SIZES = ['1-4 staff', '5-10 staff', '11-25 staff', '26-50 staff', '50+ staff'];
const CALL_VOLUMES = ['Under 10 calls/day', '10-20 calls/day', '20-40 calls/day', '40+ calls/day'];

const PERKS = [
  { icon: Clock, text: '30-minute session with a product specialist' },
  { icon: Phone, text: 'Live walkthrough of the platform' },
  { icon: Users, text: 'Tailored to your trade and team size' },
  { icon: CheckCircle, text: 'No commitment or sales pressure' },
];

const STATS: [string, string][] = [
  ['Missed calls recovered', '94%'],
  ['Reduction in no-shows', '68%'],
  ['Admin time saved per week', '6-8 hrs'],
  ['Revenue recovered (avg)', '8,400/mo'],
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  tradeType: string;
  staffSize: string;
  callVolume: string;
  message: string;
};

const EMPTY: FormState = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  tradeType: '',
  staffSize: '',
  callVolume: '',
  message: '',
};

export default function DemoPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 border border-green-800">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Request received</h1>
          <p className="text-slate-400 leading-relaxed mb-8">
            Thank you, {form.fullName.split(' ')[0]}. A member of our team will be in touch
            within one business day to confirm your demo time.
          </p>
          <Link href="/home" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to TradeBooking
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors";
  const selectClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors";
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-900 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-blue-700 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 9a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9zM13 9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zM13 15a1 1 0 00-1 1v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1h-4z" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white">TradeBooking</span>
          </Link>
          <Link href="/home" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-4">Book a Demo</p>
            <h1 className="text-3xl font-bold text-white mb-4 leading-snug">See TradeBooking in action</h1>
            <p className="text-slate-400 leading-relaxed mb-10">
              We will walk you through the platform using your business as the example. You will see
              exactly how TradeBooking handles your calls, qualifies your enquiries, and books your jobs.
            </p>

            <ul className="space-y-4 mb-12">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                    <Icon className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed pt-1">{text}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Typical results after 30 days</p>
              <div className="space-y-3">
                {STATS.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-sm font-semibold text-white">
                      {label === 'Revenue recovered (avg)' ? '\u00a3' : ''}{value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-lg font-semibold text-white mb-6">Your details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full name <span className="text-blue-500">*</span></label>
                    <input required type="text" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="James Thornton" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Company name <span className="text-blue-500">*</span></label>
                    <input required type="text" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Thornton Plumbing Ltd" className={inputClass} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Work email <span className="text-blue-500">*</span></label>
                    <input required type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="james@thorntonplumbing.co.uk" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone number <span className="text-blue-500">*</span></label>
                    <input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="07700 900000" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Trade type <span className="text-blue-500">*</span></label>
                  <select required value={form.tradeType} onChange={(e) => set('tradeType', e.target.value)} className={selectClass}>
                    <option value="" disabled>Select your trade</option>
                    {TRADE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Team size <span className="text-blue-500">*</span></label>
                    <select required value={form.staffSize} onChange={(e) => set('staffSize', e.target.value)} className={selectClass}>
                      <option value="" disabled>Select size</option>
                      {STAFF_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Inbound call volume</label>
                    <select value={form.callVolume} onChange={(e) => set('callVolume', e.target.value)} className={selectClass}>
                      <option value="">Select volume</option>
                      {CALL_VOLUMES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Anything specific you want to cover? (optional)</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="e.g. We currently miss a lot of after-hours calls and want to see how the voicemail system works."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-700 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-900/30"
                >
                  {submitting ? 'Sending request...' : 'Request your demo'}
                </button>

                <p className="text-center text-xs text-slate-600">
                  By submitting this form you agree to our{' '}
                  <Link href="/privacy" className="text-slate-500 hover:text-slate-400 underline">Privacy Policy</Link>.
                  We will never share your details with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
