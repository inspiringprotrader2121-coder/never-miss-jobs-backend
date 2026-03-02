'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError('Invalid invite link. Please ask your team owner to resend the invitation.');
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/business/users/accept-invite', { token, password });
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to accept invite';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30 border border-green-800">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Password set successfully</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your account is ready. Redirecting you to login…
          </p>
          <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Go to login now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-7 w-7 rounded bg-blue-700 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 9a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V9zM13 9a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4zM13 15a1 1 0 00-1 1v1a1 1 0 001 1h4a1 1 0 001-1v-1a1 1 0 00-1-1h-4z" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white">TradeBooking</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Accept your invitation</h1>
          <p className="text-slate-400 text-sm">Set a password to activate your account</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300">New password</Label>
              <div className="relative">
                <Input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  className="bg-slate-950 border-slate-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300">Confirm password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                autoComplete="new-password"
                className="bg-slate-950 border-slate-700 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white"
            >
              {loading ? 'Activating account…' : 'Set password and join'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
