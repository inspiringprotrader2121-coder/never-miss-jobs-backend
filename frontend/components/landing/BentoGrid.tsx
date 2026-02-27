'use client';

import { motion } from 'framer-motion';
import {
  Bot,
  CalendarDays,
  CreditCard,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  PhoneCall
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
  })
};

/* ── Card 1 – AI Answering (large, spans 2 rows on desktop) ── */
function AiCard() {
  const messages = [
    { from: 'lead', text: 'Hi, I need a boiler service ASAP' },
    { from: 'ai', text: 'I can help with that! What area are you in?' },
    { from: 'lead', text: 'Manchester, M14' },
    { from: 'ai', text: 'Perfect — I have Thursday 10am available. Shall I book that in?' },
  ];

  return (
    <motion.div
      custom={0}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative col-span-1 md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 overflow-hidden flex flex-col gap-4"
    >
      {/* Glow */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <Bot className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-white">AI Answering</p>
          <p className="text-xs text-slate-400">Powered by GPT-4o-mini · 24/7</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Chat preview */}
      <div className="flex-1 space-y-3 mt-2">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.from === 'lead' ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
            className={`flex ${msg.from === 'lead' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                msg.from === 'lead'
                  ? 'bg-slate-700 text-slate-200 rounded-br-sm'
                  : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100 rounded-bl-sm'
              }`}
            >
              {msg.from === 'ai' && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 mb-0.5 uppercase tracking-wide">
                  <Sparkles className="h-2.5 w-2.5" /> AI
                </span>
              )}
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-500">
        <MessageSquare className="h-3.5 w-3.5" />
        AI is typing…
        <span className="ml-1 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-slate-500 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Card 2 – Smart Scheduling ── */
function SchedulingCard() {
  const slots = ['Mon 9am', 'Mon 2pm', 'Tue 10am', 'Thu 9am'];
  return (
    <motion.div
      custom={1}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="rounded-3xl bg-gradient-to-br from-violet-900/60 to-slate-900 border border-white/10 p-6 flex flex-col gap-4 overflow-hidden relative"
    >
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30">
          <CalendarDays className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <p className="font-semibold text-white">Smart Scheduling</p>
          <p className="text-xs text-slate-400">Google Calendar Sync</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {slots.map((slot, i) => (
          <div
            key={slot}
            className={`rounded-lg border px-3 py-2 text-xs font-medium text-center transition-colors ${
              i === 2
                ? 'border-violet-500/60 bg-violet-500/20 text-violet-300'
                : 'border-white/10 bg-white/5 text-slate-400'
            }`}
          >
            {i === 2 && <CheckCircle2 className="h-3 w-3 inline mr-1 text-violet-400" />}
            {slot}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 flex items-center gap-1.5">
        <Clock className="h-3 w-3" />
        Syncs with your Google Calendar in real-time
      </p>
    </motion.div>
  );
}

/* ── Card 3 – Payments ── */
function PaymentsCard() {
  return (
    <motion.div
      custom={2}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="rounded-3xl bg-gradient-to-br from-blue-900/60 to-slate-900 border border-white/10 p-6 flex flex-col gap-4 overflow-hidden relative"
    >
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30">
          <CreditCard className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-white">Payments</p>
          <p className="text-xs text-slate-400">Stripe integration</p>
        </div>
      </div>
      {/* Fake card visual */}
      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 shadow-lg">
        <p className="text-[10px] text-blue-200 uppercase tracking-widest mb-3">Subscription active</p>
        <p className="text-2xl font-bold text-white">£49<span className="text-sm font-normal text-blue-200">/mo</span></p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-blue-200">TradeBooking Pro</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] text-white font-medium">ACTIVE</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Card 4 – SMS / Voice ── */
function SmsCard() {
  return (
    <motion.div
      custom={3}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="rounded-3xl bg-gradient-to-br from-orange-900/50 to-slate-900 border border-white/10 p-6 flex flex-col gap-4 overflow-hidden relative"
    >
      <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-orange-500/15 blur-2xl pointer-events-none" />
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 border border-orange-500/30">
          <PhoneCall className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <p className="font-semibold text-white">SMS & Voice Alerts</p>
          <p className="text-xs text-slate-400">Powered by Twilio</p>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: 'Missed call captured', time: '2m ago', color: 'text-orange-400' },
          { label: 'SMS confirmation sent', time: '14m ago', color: 'text-emerald-400' },
          { label: 'Reminder sent to lead', time: '1h ago', color: 'text-blue-400' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-3 py-2">
            <span className={`text-xs font-medium ${item.color}`}>{item.label}</span>
            <span className="text-[10px] text-slate-500">{item.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Everything running while you&apos;re on the tools
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            One platform replaces your receptionist, diary, and follow-up system.
          </p>
        </motion.div>

        {/* Bento grid — 3 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:grid-rows-2">
          <AiCard />
          <SchedulingCard />
          <PaymentsCard />
          <SmsCard />
        </div>
      </div>
    </section>
  );
}
