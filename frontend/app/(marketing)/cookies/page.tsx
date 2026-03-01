import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy — TradeBooking',
};

export default function CookiesPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Cookie Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-12">Last updated: 1 March 2025</p>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">1. What are cookies</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Cookies are small text files placed on your device when you visit a website. They are
              widely used to make websites work efficiently and to provide information to the website
              owner. This policy explains how TradeBooking Ltd uses cookies on tradebooking.co.uk and
              the TradeBooking platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">2. Cookies we use</h2>

            <div className="space-y-6">
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Strictly necessary cookies</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  These cookies are essential for the platform to function. They cannot be disabled.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                        <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 dark:text-slate-400">
                      {[
                        ['tb_auth', 'Authentication token for logged-in users', 'Session'],
                        ['tb_session', 'Session management and CSRF protection', '24 hours'],
                      ].map(([name, purpose, duration]) => (
                        <tr key={name} className="border-b border-slate-50 dark:border-slate-900">
                          <td className="py-2 pr-4 font-mono text-xs text-blue-600 dark:text-blue-400">{name}</td>
                          <td className="py-2 pr-4">{purpose}</td>
                          <td className="py-2">{duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Functional cookies</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  These cookies remember your preferences to improve your experience.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                        <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 dark:text-slate-400">
                      {[
                        ['tb_theme', 'Stores your light/dark mode preference', '1 year'],
                        ['tb_sidebar', 'Stores sidebar collapsed/expanded state', '1 year'],
                      ].map(([name, purpose, duration]) => (
                        <tr key={name} className="border-b border-slate-50 dark:border-slate-900">
                          <td className="py-2 pr-4 font-mono text-xs text-blue-600 dark:text-blue-400">{name}</td>
                          <td className="py-2 pr-4">{purpose}</td>
                          <td className="py-2">{duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Analytics cookies</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  These cookies help us understand how visitors use the website so we can improve it.
                  These are only set with your consent.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Name</th>
                        <th className="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-300">Purpose</th>
                        <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 dark:text-slate-400">
                      {[
                        ['_ga', 'Google Analytics — distinguishes users', '2 years'],
                        ['_ga_*', 'Google Analytics — session state', '2 years'],
                      ].map(([name, purpose, duration]) => (
                        <tr key={name} className="border-b border-slate-50 dark:border-slate-900">
                          <td className="py-2 pr-4 font-mono text-xs text-blue-600 dark:text-blue-400">{name}</td>
                          <td className="py-2 pr-4">{purpose}</td>
                          <td className="py-2">{duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">3. Managing cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-3">
              You can control and delete cookies through your browser settings. Note that disabling
              strictly necessary cookies will prevent the platform from functioning correctly.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              For guidance on managing cookies in your browser, visit{' '}
              <a
                href="https://www.aboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                aboutcookies.org
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">4. Contact</h2>
            <p className="text-slate-600 dark:text-slate-400">
              If you have questions about our use of cookies, contact{' '}
              <a href="mailto:privacy@tradebooking.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                privacy@tradebooking.co.uk
              </a>
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
          <Link href="/home" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}
