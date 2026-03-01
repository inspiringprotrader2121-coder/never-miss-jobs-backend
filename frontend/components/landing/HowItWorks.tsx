const STEPS = [
  {
    step: '01',
    title: 'Install TradeBooking',
    body:
      'Connect your phone number, add the website widget, and integrate your Google Calendar. Your account manager handles the setup. Most businesses are fully operational within 48 hours.',
    detail: [
      'Dedicated onboarding support',
      'Phone number configuration',
      'Website widget installation',
      'Team access setup',
    ],
  },
  {
    step: '02',
    title: 'Capture and qualify every enquiry',
    body:
      'From the moment TradeBooking is live, every inbound call, web enquiry, and missed call is captured, qualified, and logged. Your team receives structured lead information — not raw calls.',
    detail: [
      'Automatic call answering and qualification',
      'Missed call SMS recovery',
      'After-hours voicemail transcription',
      'Structured lead data in your dashboard',
    ],
  },
  {
    step: '03',
    title: 'Convert more enquiries into confirmed jobs',
    body:
      'Qualified leads are booked into your diary, confirmed via SMS, and reminded automatically. Deposits are collected at the point of booking. No-shows reduce. Revenue increases.',
    detail: [
      'Automated booking confirmation',
      'SMS reminders 24 hours before',
      'Deposit collection workflows',
      'Revenue tracking and reporting',
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 dark:bg-slate-900 py-24 border-t border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Operational from day one
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
            TradeBooking is not a tool that requires months of configuration. Most businesses
            are capturing and converting enquiries within 48 hours of signing up.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className={`grid lg:grid-cols-12 gap-8 lg:gap-16 py-12 ${
                i < STEPS.length - 1
                  ? 'border-b border-slate-200 dark:border-slate-800'
                  : ''
              }`}
            >
              {/* Step number + title */}
              <div className="lg:col-span-5">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-slate-100 dark:text-slate-800 leading-none select-none">
                    {s.step}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[15px]">
                  {s.body}
                </p>
              </div>

              {/* Detail list */}
              <div className="lg:col-span-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  {s.detail.map((d) => (
                    <div
                      key={d}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3"
                    >
                      <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-blue-600 dark:border-blue-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
