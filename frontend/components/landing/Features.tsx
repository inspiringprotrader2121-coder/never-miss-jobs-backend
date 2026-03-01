import {
  PhoneIncoming,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Users,
  CreditCard,
  Clock,
  ShieldCheck,
  Globe,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    title: 'Structured Lead Capture',
    body: 'Every enquiry via web, phone, or SMS is captured with job type, location, urgency, and contact details. No lead enters your system without complete information.',
  },
  {
    icon: Clock,
    title: 'After-Hours Call Automation',
    body: 'Outside working hours, calls are answered automatically. Voicemails are transcribed and leads are qualified so your team starts each day with a prioritised list.',
  },
  {
    icon: MessageSquare,
    title: 'Missed Call SMS Recovery',
    body: 'Every missed call triggers an immediate, personalised SMS. The system qualifies the lead via SMS conversation and routes it to the right team member.',
  },
  {
    icon: CreditCard,
    title: 'Deposit Collection',
    body: 'Collect booking deposits automatically at the point of confirmation. Reduce no-shows and protect your engineers time with upfront payment workflows.',
  },
  {
    icon: BarChart3,
    title: 'Admin Dashboard',
    body: 'A centralised dashboard gives your office team full visibility of enquiries, bookings, engineer schedules, and follow-up tasks in one place.',
  },
  {
    icon: Users,
    title: 'Role-Based Staff Access',
    body: 'Assign appropriate access levels to engineers, admin staff, and managers. Each team member sees what they need and nothing more.',
  },
  {
    icon: BarChart3,
    title: 'Revenue Analytics',
    body: 'Track enquiry-to-booking conversion rates, revenue by source, missed call recovery value, and engineer utilisation all in real time.',
  },
  {
    icon: CalendarCheck,
    title: 'Google Calendar Integration',
    body: 'Bookings sync directly to Google Calendar. Engineers receive job details on their phones. No double-entry. No missed appointments.',
  },
  {
    icon: ShieldCheck,
    title: 'GDPR Compliant',
    body: 'All customer data is stored and processed in accordance with UK GDPR requirements. Data residency in the United Kingdom.',
  },
];

export function Features() {
  return (
    <section id="features" className="bg-white dark:bg-slate-950 py-24 border-t border-slate-100 dark:border-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3">
            Platform Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Enterprise-grade functionality for trade operations
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
            TradeBooking is built for businesses that need reliability, not experimentation.
            Every feature is designed around the operational realities of trade companies.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-4">
                <Icon className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
