import { CheckCircle, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: '£197',
    description:
      'For trade businesses ready to automate their enquiry capture and booking confirmation process.',
    features: [
      'Website enquiry automation',
      'Missed call SMS recovery',
      'Booking confirmation SMS',
      '24-hour appointment reminders',
      'Admin dashboard',
      'Up to 3 staff accounts',
      'Google Calendar sync',
      'Email support',
    ],
    cta: 'Book a Demo',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '£297',
    description:
      'For established trade companies that need after-hours call handling and revenue analytics.',
    features: [
      'Everything in Starter',
      'After-hours call answering',
      'Voicemail transcription',
      'Deposit collection workflows',
      'Revenue tracking dashboard',
      'Up to 8 staff accounts',
      'Role-based access control',
      'Priority support',
    ],
    cta: 'Book a Demo',
    highlight: true,
  },
  {
    name: 'Business',
    price: '£397',
    description:
      'For multi-site operations and businesses requiring advanced reporting and dedicated support.',
    features: [
      'Everything in Pro',
      'Multi-site management',
      'Advanced revenue analytics',
      'Custom qualification workflows',
      'Unlimited staff accounts',
      'API access',
      'Dedicated account manager',
      'SLA-backed support',
    ],
    cta: 'Book a Demo',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white dark:bg-slate-950 py-24 border-t border-slate-100 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Business infrastructure pricing
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-14 max-w-2xl leading-relaxed">
          TradeBooking is not a small tool. It is the operational backbone of your booking
          and enquiry management. All plans are billed monthly. No setup fees. No long-term
          contracts.
        </p>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 flex flex-col ${
                plan.highlight
                  ? 'border-blue-600 dark:border-blue-500 bg-slate-50 dark:bg-slate-900 shadow-lg shadow-blue-900/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-8">
                  <span className="rounded bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 mb-1">/month</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        plan.highlight
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="text-slate-700 dark:text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/demo"
                className={`inline-flex items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-sm text-slate-400">
          All prices exclude VAT. Annual billing available at a 15% discount. Custom enterprise
          pricing available for businesses with 50+ staff.
        </p>
      </div>
    </section>
  );
}
