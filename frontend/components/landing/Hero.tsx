import { ArrowRight, CheckCircle } from 'lucide-react';

const PROOF_POINTS = [
  'Used by trade companies with 5-50 staff',
  'Handles 20+ inbound calls per day',
  'No long-term contracts',
];

const ENQUIRY_ROWS = [
  { name: 'James Thornton', job: 'Boiler replacement', status: 'Booked', statusClass: 'bg-green-900/40 text-green-400', time: '09:14' },
  { name: 'Sarah Mitchell', job: 'Emergency leak repair', status: 'Qualified', statusClass: 'bg-amber-900/40 text-amber-400', time: '10:02' },
  { name: 'R. Patel Builders', job: 'Rewire - 4 bed property', status: 'Booked', statusClass: 'bg-green-900/40 text-green-400', time: '10:45' },
  { name: 'Missed call', job: 'Roofing enquiry', status: 'SMS sent', statusClass: 'bg-blue-900/40 text-blue-400', time: '11:20' },
];

const TODAY_ITEMS = [
  { label: 'Calls answered by AI', value: '8' },
  { label: 'Missed calls recovered', value: '3' },
  { label: 'Bookings confirmed', value: '6' },
  { label: 'SMS reminders sent', value: '11' },
];

const STAT_CARDS = [
  { label: 'Enquiries this week', value: '47', change: '+12%' },
  { label: 'Jobs booked', value: '31', change: '+8%' },
  { label: 'Calls captured', value: '19', change: '100%' },
  { label: 'Revenue recovered', value: '6,240', change: '+940' },
];

export function Hero() {
  return (
    <section className="relative bg-slate-950 pt-28 pb-20 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-700/10 blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Built for UK trade businesses
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
            Automated Booking &amp; Call Management{' '}
            <span className="text-blue-400">for Trade Businesses</span>
          </h1>

          <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl">
            TradeBooking captures calls, qualifies enquiries, and books jobs automatically
            helping established trade companies operate more efficiently and increase revenue.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded bg-blue-700 hover:bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-900/30"
            >
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded border border-slate-700 hover:border-slate-500 bg-slate-900 hover:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors"
            >
              See How It Works
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {PROOF_POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-16 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            </div>
            <div className="mx-auto flex items-center gap-2 rounded border border-slate-800 bg-slate-900 px-3 py-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] text-slate-500">app.tradebooking.co.uk/dashboard</span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
              {STAT_CARDS.map((s) => (
                <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-white">
                    {s.label === 'Revenue recovered' ? '\u00a3' : ''}{s.value}
                  </p>
                  <p className="mt-1 text-xs text-green-500">
                    {s.label === 'Revenue recovered' ? '+\u00a3' : ''}{s.change}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="md:col-span-2 rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Recent Enquiries
                </p>
                <div className="space-y-2.5">
                  {ENQUIRY_ROWS.map((row) => (
                    <div key={row.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-400">
                          {row.name[0]}
                        </div>
                        <div>
                          <p className="text-slate-300 font-medium leading-none">{row.name}</p>
                          <p className="text-slate-600 text-xs mt-0.5">{row.job}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${row.statusClass}`}>
                          {row.status}
                        </span>
                        <span className="text-xs text-slate-600">{row.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Today
                </p>
                <div className="space-y-3">
                  {TODAY_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
          <p className="text-xs text-slate-600 uppercase tracking-widest">
            Trusted by trade businesses across the UK
          </p>
          {['Plumbing', 'Electrical', 'Roofing', 'Building', 'HVAC'].map((trade) => (
            <span
              key={trade}
              className="text-xs font-medium text-slate-600 border border-slate-800 rounded px-3 py-1"
            >
              {trade}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
