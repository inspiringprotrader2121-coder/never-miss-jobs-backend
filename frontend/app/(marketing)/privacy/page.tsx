import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — TradeBooking',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-100 dark:border-slate-900 px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-blue-700 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 9a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9zM13 9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zM13 15a1 1 0 00-1 1v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1h-4z" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-slate-900 dark:text-white">TradeBooking</span>
          </Link>
          <Link href="/home" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-3">Legal</p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: 1 March 2025</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">1. Who we are</h2>
            <p className="text-slate-600 dark:text-slate-400">
              TradeBooking Ltd (&quot;TradeBooking&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the platform available at
              tradebooking.co.uk. We are registered in England and Wales. This Privacy Policy explains
              how we collect, use, store, and protect personal data in accordance with the UK General
              Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-3">
              For any data protection queries, contact us at:{' '}
              <a href="mailto:privacy@tradebooking.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy@tradebooking.co.uk
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2. Data we collect</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">We collect the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-200">Account data:</strong> Name, email address, phone number, business name, and role when you register for TradeBooking.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Customer enquiry data:</strong> Contact details, job descriptions, and communication records submitted through your TradeBooking-powered website widget or phone system.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Usage data:</strong> Log data, IP addresses, browser type, pages visited, and time spent on the platform.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Payment data:</strong> Billing information processed securely by Stripe. We do not store card details on our servers.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Communication data:</strong> SMS messages, call recordings, and voicemail transcriptions processed through the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">3. How we use your data</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">We use personal data to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Provide, operate, and improve the TradeBooking platform</li>
              <li>Process bookings, payments, and subscription management</li>
              <li>Send transactional communications (booking confirmations, reminders, invoices)</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud or misuse</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mt-3">
              We do not sell personal data to third parties. We do not use personal data for
              unsolicited marketing without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">4. Legal basis for processing</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">We process personal data under the following lawful bases:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li><strong className="text-slate-800 dark:text-slate-200">Contract:</strong> Processing necessary to deliver the service you have subscribed to.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Legitimate interests:</strong> Improving the platform, preventing fraud, and ensuring security.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Legal obligation:</strong> Compliance with applicable UK law.</li>
              <li><strong className="text-slate-800 dark:text-slate-200">Consent:</strong> Where we have obtained your explicit consent, such as for marketing communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5. Data retention</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We retain account data for the duration of your subscription plus 6 years, in line with
              UK financial record-keeping requirements. Customer enquiry data is retained for 3 years
              from last activity unless you request earlier deletion. Call recordings and transcriptions
              are retained for 12 months by default.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">6. Third-party processors</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">We use the following sub-processors to deliver the service:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Processor</th>
                    <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                    <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Location</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  {[
                    ['Stripe', 'Payment processing', 'USA (SCCs)'],
                    ['Twilio', 'SMS and voice communications', 'USA (SCCs)'],
                    ['OpenAI', 'Enquiry qualification', 'USA (SCCs)'],
                    ['Google', 'Calendar integration', 'USA (SCCs)'],
                    ['AWS / Hetzner', 'Infrastructure hosting', 'EU / UK'],
                  ].map(([name, purpose, location]) => (
                    <tr key={name} className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-2 pr-4 font-medium text-slate-800 dark:text-slate-200">{name}</td>
                      <td className="py-2 pr-4">{purpose}</td>
                      <td className="py-2">{location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm">
              SCCs = Standard Contractual Clauses under UK GDPR for international data transfers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">7. Your rights</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">Under UK GDPR you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Access the personal data we hold about you</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mt-3">
              To exercise any of these rights, email{' '}
              <a href="mailto:privacy@tradebooking.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy@tradebooking.co.uk
              </a>
              . We will respond within 30 days. You also have the right to lodge a complaint with the
              Information Commissioner&apos;s Office (ICO) at ico.org.uk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">8. Security</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We implement appropriate technical and organisational measures to protect personal data
              against unauthorised access, loss, or destruction. These include encryption in transit
              (TLS), encrypted storage, access controls, and regular security reviews.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">9. Changes to this policy</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We may update this Privacy Policy from time to time. Material changes will be communicated
              to registered users via email at least 14 days before they take effect. Continued use of
              the platform after that date constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cookie Policy</Link>
          <Link href="/home" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}
