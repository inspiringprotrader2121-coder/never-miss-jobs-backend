'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  AlertCircle,
  Zap
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Business {
  id: string;
  name: string;
  phoneNumber: string | null;
  websiteUrl: string | null;
}

interface WorkingHours {
  open: string;
  close: string;
  enabled: boolean;
}

interface AiSettings {
  welcomeMessage: string | null;
  qualificationPrompt: string | null;
  afterHoursMessage: string | null;
  timezone: string | null;
  modelName: string | null;
  workingHoursJson: Record<string, WorkingHours> | null;
}

interface CalendarStatus {
  connected: boolean;
  calendarId: string;
}

interface Subscription {
  status: string;
  planCode: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function BusinessTab({ business, loading }: { business: Business | undefined; loading: boolean }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', phoneNumber: '', websiteUrl: '' });

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name ?? '',
        phoneNumber: business.phoneNumber ?? '',
        websiteUrl: business.websiteUrl ?? ''
      });
    }
  }, [business]);

  const save = useMutation({
    mutationFn: () => api.patch('/business', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] });
      toast.success('Business details saved');
    },
    onError: () => toast.error('Failed to save')
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business details</CardTitle>
        <CardDescription>Your business name and contact information</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <div className="space-y-1.5">
              <Label>Business name</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Phone number</Label>
              <Input value={form.phoneNumber ?? ''} onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))} placeholder="+44 7700 900000" />
            </div>
            <div className="space-y-1.5">
              <Label>Website URL</Label>
              <Input value={form.websiteUrl ?? ''} onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://tradebooking.co.uk" />
            </div>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (form.newPassword !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to update password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label>Current password</Label>
            <Input type="password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} required autoComplete="current-password" />
          </div>
          <div className="space-y-1.5">
            <Label>New password</Label>
            <Input type="password" value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} required autoComplete="new-password" placeholder="At least 8 characters" />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm new password</Label>
            <Input type="password" value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} required autoComplete="new-password" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type Day = typeof DAYS[number];

const DEFAULT_HOURS: Record<Day, WorkingHours> = {
  monday:    { open: '08:00', close: '18:00', enabled: true },
  tuesday:   { open: '08:00', close: '18:00', enabled: true },
  wednesday: { open: '08:00', close: '18:00', enabled: true },
  thursday:  { open: '08:00', close: '18:00', enabled: true },
  friday:    { open: '08:00', close: '18:00', enabled: true },
  saturday:  { open: '09:00', close: '13:00', enabled: false },
  sunday:    { open: '09:00', close: '13:00', enabled: false },
};

const AI_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (fast, recommended)' },
  { value: 'gpt-4o',      label: 'GPT-4o (more capable, higher cost)' },
];

function AiTab({ aiSettings, loading }: { aiSettings: AiSettings | undefined; loading: boolean }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    welcomeMessage: '',
    qualificationPrompt: '',
    afterHoursMessage: '',
    timezone: 'Europe/London',
    modelName: 'gpt-4o-mini',
  });
  const [hours, setHours] = useState<Record<Day, WorkingHours>>(DEFAULT_HOURS);

  useEffect(() => {
    if (aiSettings) {
      setForm({
        welcomeMessage: aiSettings.welcomeMessage ?? '',
        qualificationPrompt: aiSettings.qualificationPrompt ?? '',
        afterHoursMessage: aiSettings.afterHoursMessage ?? '',
        timezone: aiSettings.timezone ?? 'Europe/London',
        modelName: aiSettings.modelName ?? 'gpt-4o-mini',
      });
      if (aiSettings.workingHoursJson) {
        setHours({ ...DEFAULT_HOURS, ...(aiSettings.workingHoursJson as Record<Day, WorkingHours>) });
      }
    }
  }, [aiSettings]);

  const save = useMutation({
    mutationFn: () => api.patch('/business/ai-settings', { ...form, workingHoursJson: hours }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      toast.success('AI settings saved');
    },
    onError: () => toast.error('Failed to save')
  });

  function setHour(day: Day, field: keyof WorkingHours, value: string | boolean) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  const textareaClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI assistant</CardTitle>
          <CardDescription>Customise how your AI chat widget behaves</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
              <div className="space-y-1.5">
                <Label>AI model</Label>
                <select
                  value={form.modelName}
                  onChange={(e) => setForm((f) => ({ ...f, modelName: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Welcome message</Label>
                <textarea
                  rows={2}
                  className={textareaClass}
                  value={form.welcomeMessage}
                  onChange={(e) => setForm((f) => ({ ...f, welcomeMessage: e.target.value }))}
                  placeholder="Hi! How can we help with your job today?"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Qualification instructions</Label>
                <textarea
                  rows={3}
                  className={textareaClass}
                  value={form.qualificationPrompt}
                  onChange={(e) => setForm((f) => ({ ...f, qualificationPrompt: e.target.value }))}
                  placeholder="Always ask for job type, location, and urgency. Collect the customer's name and phone number before booking."
                />
                <p className="text-xs text-muted-foreground">Instructions for how the AI should qualify leads</p>
              </div>

              <div className="space-y-1.5">
                <Label>After-hours message</Label>
                <textarea
                  rows={2}
                  className={textareaClass}
                  value={form.afterHoursMessage}
                  onChange={(e) => setForm((f) => ({ ...f, afterHoursMessage: e.target.value }))}
                  placeholder="We're closed right now. Leave your details and we'll call you back first thing tomorrow."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <select
                  value={form.timezone}
                  onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Europe/London">Europe/London (UK)</option>
                  <option value="Europe/Dublin">Europe/Dublin (Ireland)</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
                <p className="text-xs text-muted-foreground">Used to determine when after-hours mode activates</p>
              </div>

              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? 'Saving…' : 'Save AI settings'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Working hours */}
      <Card>
        <CardHeader>
          <CardTitle>Working hours</CardTitle>
          <CardDescription>
            Outside these hours, the AI switches to after-hours mode and calls go to voicemail
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{[1,2,3,4,5,6,7].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <div className="space-y-3">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={hours[day].enabled}
                      onChange={(e) => setHour(day, 'enabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`day-${day}`} className="text-sm font-medium capitalize cursor-pointer">
                      {day.slice(0, 3).charAt(0).toUpperCase() + day.slice(1, 3)}
                    </label>
                  </div>
                  {hours[day].enabled ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={hours[day].open}
                        onChange={(e) => setHour(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={hours[day].close}
                        onChange={(e) => setHour(day, 'close', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => save.mutate()}
                  disabled={save.isPending}
                >
                  {save.isPending ? 'Saving…' : 'Save working hours'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarTab() {
  const queryClient = useQueryClient();

  const { data: status, isLoading } = useQuery<CalendarStatus>({
    queryKey: ['calendar-status'],
    queryFn: () => api.get('/business/calendar/status').then(({ data }) => data)
  });

  const connect = useMutation({
    mutationFn: () => api.get('/business/calendar/connect').then(({ data }) => data),
    onSuccess: (data: { url: string }) => {
      window.location.href = data.url;
    },
    onError: () => toast.error('Could not start Google Calendar connection')
  });

  const disconnect = useMutation({
    mutationFn: () => api.delete('/business/calendar/disconnect'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-status'] });
      toast.success('Google Calendar disconnected');
    },
    onError: () => toast.error('Failed to disconnect')
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar
        </CardTitle>
        <CardDescription>
          Sync appointments automatically to your Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : status?.connected ? (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Connected</p>
                <p className="text-xs text-green-600">
                  Appointments sync to calendar: <strong>{status.calendarId}</strong>
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              New and updated appointments are automatically added to your Google Calendar.
              Cancelled appointments are removed.
            </p>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => disconnect.mutate()}
              disabled={disconnect.isPending}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {disconnect.isPending ? 'Disconnecting…' : 'Disconnect Google Calendar'}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <XCircle className="h-5 w-5 text-slate-400" />
              <p className="text-sm text-slate-600">Not connected</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect your Google account to automatically sync all appointments.
              You&apos;ll be redirected to Google to grant access — we only request
              permission to create and manage calendar events.
            </p>
            <Button onClick={() => connect.mutate()} disabled={connect.isPending}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {connect.isPending ? 'Connecting…' : 'Connect Google Calendar'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BillingTab() {
  const { data: statsData } = useQuery<{ subscription: Subscription | null }>({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/business/stats').then(({ data }) => data)
  });

  const sub = statsData?.subscription;

  const portal = useMutation({
    mutationFn: () =>
      api.post<{ url: string }>('/billing/portal-session', { returnUrl: window.location.href })
        .then(({ data }) => data),
    onSuccess: (data) => { window.location.href = data.url; },
    onError: () => toast.error('Could not open billing portal')
  });

  const checkout = useMutation({
    mutationFn: () =>
      api.post<{ url: string }>('/billing/checkout-session', {
        successUrl: `${window.location.origin}/dashboard/settings?tab=billing&upgraded=1`,
        cancelUrl: window.location.href
      }).then(({ data }) => data),
    onSuccess: (data) => { window.location.href = data.url; },
    onError: () => toast.error('Could not start checkout')
  });

  const STATUS_BADGE: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    TRIALING: 'bg-blue-100 text-blue-800',
    PAST_DUE: 'bg-red-100 text-red-800',
    CANCELED: 'bg-gray-100 text-gray-700'
  };

  const trialDaysLeft =
    sub?.status === 'TRIALING' && sub.trialEndsAt
      ? Math.max(0, Math.ceil((new Date(sub.trialEndsAt).getTime() - Date.now()) / 86400000))
      : null;

  const needsUpgrade = !sub || sub.status === 'CANCELED' || sub.status === 'PAST_DUE' || (sub.status === 'TRIALING' && trialDaysLeft !== null && trialDaysLeft <= 3);

  return (
    <div className="space-y-4">
      {/* Upgrade prompt */}
      {needsUpgrade && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-blue-900">
                  {sub?.status === 'CANCELED'
                    ? 'Your subscription has ended'
                    : sub?.status === 'PAST_DUE'
                    ? 'Payment overdue'
                    : trialDaysLeft !== null
                    ? `Trial ends in ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''}`
                    : 'Upgrade to continue'}
                </p>
                <p className="text-sm text-blue-700">
                  Subscribe to keep your AI chat, bookings, and SMS features running.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => checkout.mutate()}
                  disabled={checkout.isPending}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {checkout.isPending ? 'Loading…' : 'Subscribe now'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage your subscription and payment method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sub ? (
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[sub.status] ?? 'bg-gray-100 text-gray-700'}`}>
                {sub.status}
              </span>
              <span className="text-sm text-muted-foreground capitalize">{sub.planCode}</span>
              {sub.currentPeriodEnd && sub.status === 'ACTIVE' && (
                <span className="text-xs text-muted-foreground">
                  · Renews {new Date(sub.currentPeriodEnd).toLocaleDateString('en-GB')}
                </span>
              )}
              {trialDaysLeft !== null && (
                <Badge variant="secondary">{trialDaysLeft}d trial left</Badge>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              No active subscription
            </div>
          )}

          {sub && sub.status !== 'CANCELED' && (
            <>
              <p className="text-sm text-muted-foreground">
                Update your payment method, download invoices, or cancel your subscription
                through the Stripe billing portal.
              </p>
              <Button variant="outline" onClick={() => portal.mutate()} disabled={portal.isPending}>
                {portal.isPending ? 'Opening…' : 'Manage billing →'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

function SettingsContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') ?? 'business';

  const { data: business, isLoading: bizLoading } = useQuery<Business>({
    queryKey: ['business'],
    queryFn: () => api.get('/business').then(({ data }) => data)
  });

  const { data: aiSettings, isLoading: aiLoading } = useQuery<AiSettings>({
    queryKey: ['ai-settings'],
    queryFn: () => api.get('/business/ai-settings').then(({ data }) => data)
  });

  // Show success toast if redirected back after Google Calendar connect
  useEffect(() => {
    if (searchParams.get('calendar') === 'connected') {
      toast.success('Google Calendar connected successfully!');
    }
    if (searchParams.get('upgraded') === '1') {
      toast.success('Subscription activated! Welcome aboard.');
    }
  }, [searchParams]);

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and integrations.</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="ai">AI assistant</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-4">
          <BusinessTab business={business} loading={bizLoading} />
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <AiTab aiSettings={aiSettings} loading={aiLoading} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <CalendarTab />
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <PasswordTab />
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <BillingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-96 w-full" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}

