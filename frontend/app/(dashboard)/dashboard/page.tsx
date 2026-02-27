'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, CalendarDays, MessageSquare, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsData {
  leads: { total: number };
  bookings: { total: number };
  subscription: { status: string; planCode: string } | null;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  loading
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads-count'],
    queryFn: () => api.get('/crm/leads?limit=1').then((r) => r.data)
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings-count'],
    queryFn: () => api.get('/bookings?limit=1').then((r) => r.data)
  });

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.get('/billing/subscription').then((r) => r.data)
  });

  const { data: businessData } = useQuery({
    queryKey: ['business'],
    queryFn: () => api.get('/business').then((r) => r.data)
  });

  return (
    <div>
      <Header title="Overview" />
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-700">
            {businessData?.name ?? 'Your business'}
          </h2>
          <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Leads"
            value={leadsData?.total ?? 0}
            icon={Users}
            description="All time"
            loading={leadsLoading}
          />
          <StatCard
            title="Appointments"
            value={bookingsData?.total ?? 0}
            icon={CalendarDays}
            description="All time"
            loading={bookingsLoading}
          />
          <StatCard
            title="AI Conversations"
            value="—"
            icon={MessageSquare}
            description="Coming soon"
          />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Subscription
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      subData?.subscription?.status === 'ACTIVE' ? 'default' : 'secondary'
                    }
                  >
                    {subData?.subscription?.status ?? 'No plan'}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {subData?.subscription?.planCode}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>→ Go to <strong>Leads</strong> to view and manage enquiries</p>
              <p>→ Go to <strong>Bookings</strong> to create appointments</p>
              <p>→ Go to <strong>AI Chat</strong> to test your website widget</p>
              <p>→ Go to <strong>Settings</strong> to configure your AI assistant</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your AI widget URL</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">
                Embed this endpoint in your website chat widget:
              </p>
              <code className="block bg-slate-100 rounded p-2 text-xs break-all">
                {process.env.NEXT_PUBLIC_API_URL}/ai/public/chat/
                {businessData?.id ?? '<businessId>'}
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
