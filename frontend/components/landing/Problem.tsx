const PROBLEMS = [
  {
    num: '01',
    title: 'Missed calls are missed revenue',
    body: 'Every unanswered call is a job that goes to a competitor. For a trade business taking 20+ calls per day, even a 20% miss rate represents thousands of pounds in lost revenue each month.',
  },
  {
    num: '02',
    title: 'Admin teams are stretched thin',
    body: 'Your office staff are managing calls, chasing quotes, scheduling engineers, and handling complaints simultaneously. Manual processes create bottlenecks that slow down your entire operation.',
  },
  {
    num: '03',
    title: 'After-hours enquiries go unanswered',
    body: 'A significant portion of inbound enquiries arrive outside working hours. Without an automated system, those leads go cold overnight and book with whoever responds first in the morning.',
  },
  {
    num: '04',
    title: 'Manual booking creates errors',
    body: 'Double-bookings, incorrect job details, and missed confirmations damage your reputation and cost money. Manual diary management does not scale as your business grows.',
  },
  {
    num: '05',
    title: 'No-shows impact your margins',
    body: 'Without automated reminders and confirmation workflows, no-show rates remain high. Each wasted engineer visit is a direct hit to your profitability.',
  },
  {
    num: '06',
    title: 'No visibility across the operation',
    body: 'Without centralised reporting, it is difficult to know which enquiry sources are converting, which engineers are most productive, or where revenue is being lost.',
  },
];

export function Problem() {
  return (
    <section className="bg-white dark:bg-slate-950 py-24 border-t border-slate-100 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3">
            The Problem
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Established trade businesses lose revenue through operational gaps
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
            These are not startup problems. They are the operational challenges that affect
            trade companies with real staff, real volume, and real revenue at stake.
          </p>
        </div>

        <div className="grid gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.num}
              className="bg-white dark:bg-slate-950 p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-400 dark:text-slate-600">
                  {p.num}
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
