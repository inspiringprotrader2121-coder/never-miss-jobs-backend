const STATS = [
  {
    value: '94%',
    label: 'Enquiry capture rate',
    detail: 'Across web, phone, and after-hours channels combined',
  },
  {
    value: '3.2x',
    label: 'More jobs booked',
    detail: 'Compared to manual booking processes in the same business',
  },
  {
    value: '68%',
    label: 'Reduction in no-shows',
    detail: 'Through automated confirmation and reminder workflows',
  },
  {
    value: '£8,400',
    label: 'Average monthly revenue recovered',
    detail: 'From missed calls and after-hours enquiries per business',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'We were losing jobs every week to missed calls and slow follow-up. TradeBooking changed that within the first month. The missed call recovery alone paid for the platform.',
    name: 'Operations Director',
    company: 'Commercial plumbing contractor, 12 staff',
  },
  {
    quote:
      'Our admin team was spending three hours a day on booking calls. That time is now spent on jobs that actually need human attention. The system handles everything routine.',
    name: 'Managing Director',
    company: 'Electrical services company, 8 engineers',
  },
];

export function Impact() {
  return (
    <section className="bg-slate-950 py-24 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">
            Revenue Impact
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Measurable results for trade operations
          </h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            The following figures are based on aggregate data from TradeBooking customers
            operating in the UK plumbing, electrical, and roofing sectors.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className="bg-slate-950 p-8">
              <p className="text-4xl font-bold text-white mb-2">{s.value}</p>
              <p className="text-sm font-semibold text-blue-400 mb-2">{s.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-800 bg-slate-900 p-8"
            >
              <svg className="h-6 w-6 text-blue-700 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-300 leading-relaxed mb-6 text-[15px]">{t.quote}</p>
              <div className="border-t border-slate-800 pt-4">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
