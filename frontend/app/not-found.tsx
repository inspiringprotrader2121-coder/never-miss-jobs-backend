import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 text-center">
      <div className="flex items-center gap-2 mb-8">
        <Zap className="h-7 w-7 text-blue-400" />
        <span className="text-2xl font-bold">TradeBooking</span>
      </div>

      <p className="text-8xl font-extrabold text-blue-400 leading-none">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-400 max-w-sm">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or deleted.
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>
        <Link href="/home">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
