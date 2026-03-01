const CAPABILITIES = [
  {
    num: '01',
    title: 'Website Enquiry Automation',
    body: 'Capture and qualify every website enquiry automatically. TradeBooking collects job type, location, urgency, and contact details before your team gets involved.',
  },
  {
    num: '02',
    title: 'Missed Call Recovery',
    body: 'When a call goes unanswered, TradeBooking immediately sends a personalised SMS to the caller, captures their requirements, and routes the lead to the right team member.',
  },
  {
    num: '03',
    title: 'After-Hours Call Handling',
    body: 'Outside working hours, TradeBooking answers calls, takes voicemails with transcription, and qualifies enquiries so your team starts each day with a structured lead list.',
  },
  {
    num: '04',
    title: 'Smart Job Booking',
    body: 'Qualified leads are booked directly into your diary with engineer availability checked in real time. Appointments sync to Google Calendar and trigger SMS confirmations automatically.',
  },
  {
    num: '05',
    title: 'Automated SMS Workflows',
    body: 'Booking confirmations, 24-hour reminders, and follow-up messages are sent automatically. No-show rates drop. Customer satisfaction improves.',
  },
  {
    num: '06',
    title: 'Revenue Tracking Dashboard',
    body: 'A single dashboard shows enquiry volume, conversion rates, revenue recovered from missed calls, and team performance giving management the visibility to make decisions.',
  },
];

export function Solution() {
  return (
    <section id="solution" className="bg-slate-50 dark:bg-slate-900 py-24 border-t border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-4 mb-12 lg:mb-0 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3">
              The Solution
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl leading-snug">
              One platform. Every stage of the booking process.
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              TradeBooking replaces the manual processes that slow your operation down
              from first contact to confirmed job without replacing your team.
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex items-center rounded bg-blue-700 hover:bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Book a Demo
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 divide-y divide-slate-200 dark:divide-slate-800">
            {CAPABILITIES.map((cap) => (
              <div key={cap.num} className="py-7 flex gap-6">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-xs font-bold text-blue-700 dark:text-blue-400">
                    {cap.num}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cap.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
