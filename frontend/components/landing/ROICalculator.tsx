'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, PoundSterling, Zap } from 'lucide-react';

const MISS_RATE = 0.20;       // 20% of leads are missed without the tool
const AVG_JOB_VALUE = 320;    // £320 average job value for UK trades
const MINS_PER_LEAD = 12;     // minutes saved qualifying each lead manually

function formatGBP(n: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0
  }).format(n);
}

export function ROICalculator() {
  const [leads, setLeads] = useState(30);

  const missedLeads = Math.round(leads * MISS_RATE);
  const revenueRecovered = missedLeads * AVG_JOB_VALUE;
  const hoursSaved = Math.round((leads * MINS_PER_LEAD) / 60);
  const roi = revenueRecovered - 49; // minus monthly subscription

  const stats = [
    {
      icon: TrendingUp,
      label: 'Leads recovered',
      value: `${missedLeads} jobs`,
      sub: `${MISS_RATE * 100}% miss rate eliminated`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: PoundSterling,
      label: 'Revenue recovered',
      value: formatGBP(revenueRecovered),
      sub: `At avg. ${formatGBP(AVG_JOB_VALUE)} per job`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: Clock,
      label: 'Hours saved',
      value: `${hoursSaved}h / month`,
      sub: `${MINS_PER_LEAD} mins per lead qualification`,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20'
    },
    {
      icon: Zap,
      label: 'Net ROI',
      value: formatGBP(roi),
      sub: 'After £49/mo subscription',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20'
    }
  ];

  return (
    <section id="roi" className="py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-400 uppercase tracking-widest mb-4">
            ROI Calculator
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            See what you&apos;re leaving on the table
          </h2>
          <p className="mt-3 text-slate-400">
            Drag the slider to your monthly lead volume and watch the numbers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-slate-800/60 backdrop-blur-sm p-8"
        >
          {/* Slider */}
          <div className="mb-10">
            <div className="flex items-end justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                Leads per month
              </label>
              <span className="text-3xl font-extrabold text-white tabular-nums">
                {leads}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={leads}
              onChange={(e) => setLeads(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer
                bg-gradient-to-r from-emerald-500 to-emerald-400
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-emerald-500/50
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-emerald-400"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #34d399 ${((leads - 5) / 195) * 100}%, #1e293b ${((leads - 5) / 195) * 100}%, #1e293b 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1.5">
              <span>5</span>
              <span>100</span>
              <span>200</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
              <motion.div
                key={label}
                layout
                className={`rounded-2xl border p-5 ${bg}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <motion.p
                  key={value}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`text-2xl font-extrabold ${color} tabular-nums`}
                >
                  {value}
                </motion.p>
                <p className="mt-1 text-xs text-slate-500">{sub}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Based on a 20% missed-lead rate and £320 average job value for UK trades.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
