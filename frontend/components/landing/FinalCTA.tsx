import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="bg-slate-950 py-24 border-t border-slate-900"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-4">
            Get Started
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Upgrade Your Booking System.
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
            Join trade businesses across the UK that have replaced manual booking
            processes with TradeBooking. Speak to our team and see the platform
            in operation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:hello@tradebooking.co.uk"
              className="inline-flex items-center gap-2 rounded bg-blue-700 hover:bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-colors shadow-lg shadow-blue-900/40"
            >
              Book Your Demo
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded border border-slate-700 hover:border-slate-500 bg-transparent hover:bg-slate-900 px-8 py-3.5 text-base font-semibold text-slate-300 transition-colors"
            >
              Start Free Trial
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-600">
            No commitment required. Demos are 30 minutes with a product specialist.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-20 border-t border-slate-900 pt-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded bg-blue-700 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                  <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 9a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9zM13 9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zM13 15a1 1 0 00-1 1v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1h-4z" />
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-white">TradeBooking</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-500">
              <a href="#solution" className="hover:text-slate-300 transition-colors">Solutions</a>
              <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
              <a href="/login" className="hover:text-slate-300 transition-colors">Client Login</a>
              <a href="mailto:hello@tradebooking.co.uk" className="hover:text-slate-300 transition-colors">Contact</a>
            </div>

            {/* Legal */}
            <div className="text-xs text-slate-600 space-y-1 text-right">
              <p>© {new Date().getFullYear()} TradeBooking Ltd. All rights reserved.</p>
              <p>Registered in England &amp; Wales · tradebooking.co.uk</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-700">
            <span className="cursor-pointer hover:text-slate-500 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-slate-500 transition-colors">Terms of Service</span>
            <span className="cursor-pointer hover:text-slate-500 transition-colors">Cookie Policy</span>
            <span className="cursor-pointer hover:text-slate-500 transition-colors">GDPR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
