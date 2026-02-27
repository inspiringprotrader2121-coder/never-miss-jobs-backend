'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Users,
  CalendarDays,
  MessageSquare,
  PhoneMissed,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface DashboardStats {
  leads: { total: number; today: number; last7Days: number };
  appointments: { total: number; upcoming: number };
  conversations: { total: number; last7Days: number };
  missedCalls: { last30Days: number };
  subscription: {
    status: string;
    planCode: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
  } | null;
}

interface Business {
  id: string;
  name: string;
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  href,
  loading,
  accent
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
  loading?: boolean;
  accent?: string;
}) {
  const inner = (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${accent ?? 'bg-slate-100'}`}>
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className="text-3xl font-bold">{value}</div>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </>
        )}
        {href && !loading && (
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600">
            View all <ArrowUpRight className="h-3 w-3" />
          </p>
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  TRIALING: 'bg-blue-100 text-blue-800',
  PAST_DUE: 'bg-red-100 text-red-800',
  CANCELED: 'bg-gray-100 text-gray-700'
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/business/stats').then((r) => r.data),
    refetchInterval: 60_000
  });

  const { data: business } = useQuery<Business>({
    queryKey: ['business'],
    queryFn: () => api.get('/business').then((r) => r.data)
  });

  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? '';
  const widgetUrl = business?.id
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/widget/${business.id}`
    : null;

  const trialDaysLeft =
    stats?.subscription?.status === 'TRIALING' && stats.subscription.trialEndsAt
      ? Math.max(
          0,
          Math.ceil(
            (new Date(stats.subscription.trialEndsAt).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {business?.name ?? 'Dashboard'}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* Trial banner */}
      {trialDaysLeft !== null && (
        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <Zap className="h-4 w-4 shrink-0" />
          <span>
            Your free trial ends in <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''}</strong>.{' '}
            <Link href="/dashboard/settings" className="underline font-medium">
              Upgrade now
            </Link>{' '}
            to keep access.
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={stats?.leads.total ?? 0}
          sub={`+${stats?.leads.today ?? 0} today · +${stats?.leads.last7Days ?? 0} this week`}
          icon={Users}
          href="/dashboard/leads"
          loading={statsLoading}
          accent="bg-purple-100"
        />
        <StatCard
          title="Upcoming Appointments"
          value={stats?.appointments.upcoming ?? 0}
          sub={`${stats?.appointments.total ?? 0} total all time`}
          icon={CalendarDays}
          href="/dashboard/bookings"
          loading={statsLoading}
          accent="bg-green-100"
        />
        <StatCard
          title="AI Conversations"
          value={stats?.conversations.last7Days ?? 0}
          sub={`Last 7 days · ${stats?.conversations.total ?? 0} total`}
          icon={MessageSquare}
          href="/dashboard/chat"
          loading={statsLoading}
          accent="bg-blue-100"
        />
        <StatCard
          title="Missed Calls"
          value={stats?.missedCalls.last30Days ?? 0}
          sub="Last 30 days"
          icon={PhoneMissed}
          href="/dashboard/voice"
          loading={statsLoading}
          accent="bg-orange-100"
        />
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Subscription */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscription
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {statsLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : stats?.subscription ? (
              <>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[stats.subscription.status] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {stats.subscription.status}
                </span>
                {stats.subscription.currentPeriodEnd && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Renews{' '}
                    {new Date(stats.subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
                  </p>
                )}
                <Link
                  href="/dashboard/settings"
                  className="block text-xs font-medium text-blue-600 hover:underline"
                >
                  Manage billing →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No active plan</p>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { href: '/dashboard/leads', label: 'View new leads' },
              { href: '/dashboard/bookings', label: 'Create an appointment' },
              { href: '/dashboard/chat', label: 'Test AI chat' },
              { href: '/dashboard/settings', label: 'Configure AI assistant' },
              { href: '/dashboard/team', label: 'Manage team' }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                {label}
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Widget embed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Website Chat Widget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Paste this into any webpage to add your AI chat widget:
            </p>
            {widgetUrl ? (
              <code className="block rounded bg-slate-100 p-2 text-xs break-all leading-relaxed">
                {`<iframe src="${widgetUrl}" style="position:fixed;bottom:20px;right:20px;width:380px;height:580px;border:none;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:9999;"></iframe>`}
              </code>
            ) : (
              <Skeleton className="h-16 w-full" />
            )}
            {widgetUrl && (
              <Link
                href={widgetUrl}
                target="_blank"
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Preview widget →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
