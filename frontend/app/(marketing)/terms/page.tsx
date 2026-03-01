import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — TradeBooking',
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: 1 March 2025</p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">1. Agreement</h2>
            <p className="text-slate-600 dark:text-slate-400">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the TradeBooking
              platform operated by TradeBooking Ltd, registered in England and Wales. By creating an
              account or using the platform, you agree to be bound by these Terms. If you do not agree,
              do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2. The service</h2>
            <p className="text-slate-600 dark:text-slate-400">
              TradeBooking provides a SaaS platform for trade businesses to automate enquiry capture,
              call management, job booking, and related operational workflows. The platform includes
              web-based tools, SMS and voice integrations, calendar synchronisation, and a management
              dashboard. Features vary by subscription tier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">3. Accounts and access</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              You are responsible for maintaining the security of your account credentials. You must
              not share login details with individuals outside your organisation. You are responsible
              for all activity that occurs under your account.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              You must provide accurate information when registering. Accounts created with false
              information may be suspended without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">4. Subscriptions and billing</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              TradeBooking is offered on a monthly subscription basis. Pricing is as published on the
              website at the time of subscription. All prices are exclusive of VAT. VAT will be charged
              at the applicable UK rate.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              Subscriptions renew automatically each month unless cancelled before the renewal date.
              You may cancel at any time through your account settings. Cancellation takes effect at
              the end of the current billing period. No refunds are issued for partial months.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              We reserve the right to change pricing with 30 days written notice to registered users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">5. Acceptable use</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">You must not use TradeBooking to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Send unsolicited commercial communications (spam)</li>
              <li>Harass, threaten, or deceive any person</li>
              <li>Violate any applicable law or regulation</li>
              <li>Attempt to gain unauthorised access to any system or data</li>
              <li>Reverse engineer, decompile, or copy the platform</li>
              <li>Resell or sublicense access to the platform without written permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">6. Data and privacy</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Your use of the platform is also governed by our{' '}
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.
              As a business using TradeBooking to process your customers&apos; personal data, you act as
              a data controller and TradeBooking acts as a data processor. A Data Processing Agreement
              is available on request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">7. Availability and support</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We aim to maintain platform availability of 99.5% per calendar month, excluding
              scheduled maintenance windows. We do not guarantee uninterrupted service. Support is
              provided by email during UK business hours. Response times vary by subscription tier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">8. Limitation of liability</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              To the maximum extent permitted by law, TradeBooking Ltd shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the
              platform, including but not limited to loss of revenue, loss of data, or loss of
              business opportunity.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Our total aggregate liability to you in any 12-month period shall not exceed the total
              subscription fees paid by you during that period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">9. Termination</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We may suspend or terminate your account immediately if you breach these Terms, fail to
              pay subscription fees, or engage in conduct that we reasonably believe is harmful to
              other users or the platform. Upon termination, your access to the platform will cease
              and your data will be retained for 30 days before deletion, unless a longer period is
              required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">10. Governing law</h2>
            <p className="text-slate-600 dark:text-slate-400">
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject
              to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">11. Changes to these Terms</h2>
            <p className="text-slate-600 dark:text-slate-400">
              We may update these Terms from time to time. We will notify registered users of material
              changes by email at least 14 days before they take effect. Continued use of the platform
              after that date constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">12. Contact</h2>
            <p className="text-slate-600 dark:text-slate-400">
              For any queries regarding these Terms, contact us at{' '}
              <a href="mailto:legal@tradebooking.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                legal@tradebooking.co.uk
              </a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/cookies" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Cookie Policy</Link>
          <Link href="/home" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}
