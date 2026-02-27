'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Zap } from 'lucide-react';

const PERKS = [
  '14-day free trial, no card needed',
  'AI chat live on your site in minutes',
  'Missed call capture from day one',
  'Cancel any time'
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    fullName: '',
    email: '',
    password: ''
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to TradeBooking.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Left panel — perks */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[420px] shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <Zap className="h-7 w-7 text-blue-400" />
          <span className="text-2xl font-bold text-white">TradeBooking</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white leading-snug">
          Start winning more jobs today
        </h2>
        <p className="mt-3 text-slate-400">
          Join tradespeople across the UK who never miss a job enquiry.
        </p>
        <ul className="mt-8 space-y-4">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
              {perk}
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TradeBooking</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Free for 14 days · No credit card required
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Smith's Plumbing Ltd"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Your name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Smith"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account…' : 'Create free account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            By creating an account you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
