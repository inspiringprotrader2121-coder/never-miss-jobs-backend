'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  CalendarDays,
  Edit2,
  Check,
  X,
  Send
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  conversations: {
    id: string;
    type: string;
    createdAt: string;
    messages: { id: string; senderLabel: string; content: string; createdAt: string }[];
  }[];
  appointments: {
    id: string;
    startsAt: string;
    endsAt: string;
    status: string;
    notes: string | null;
  }[];
}

const STATUS_COLOURS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  CUSTOMER: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-600'
};

const APPT_COLOURS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  CONFIRMED: 'default',
  PENDING: 'secondary',
  CANCELLED: 'destructive',
  NO_SHOW: 'outline'
};

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', email: '', phone: '', notes: '', status: '' });
  const [showSms, setShowSms] = useState(false);
  const [smsBody, setSmsBody] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  const { data: lead, isLoading } = useQuery<Lead>({
    queryKey: ['lead', id],
    queryFn: () => api.get(`/crm/leads/${id}`).then(({ data }) => data)
  });

  // Pre-fill edit form whenever lead data loads (useQuery v5 removed onSuccess)
  useEffect(() => {
    if (lead) {
      setEditForm({
        fullName: lead.fullName ?? '',
        email: lead.email ?? '',
        phone: lead.phone ?? '',
        notes: lead.notes ?? '',
        status: lead.status
      });
    }
  }, [lead]);

  const updateLead = useMutation({
    mutationFn: () => api.patch(`/crm/leads/${id}`, editForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated');
      setEditing(false);
    },
    onError: () => toast.error('Failed to update lead')
  });

  const archiveLead = useMutation({
    mutationFn: () => api.delete(`/crm/leads/${id}`),
    onSuccess: () => {
      toast.success('Lead archived');
      router.push('/dashboard/leads');
    },
    onError: () => toast.error('Failed to archive lead')
  });

  async function handleSendSms(e: React.FormEvent) {
    e.preventDefault();
    if (!lead?.phone || !smsBody.trim()) return;
    setSendingSms(true);
    try {
      await api.post('/sms/send', { toPhone: lead.phone, body: smsBody });
      toast.success('SMS sent');
      setSmsBody('');
      setShowSms(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to send SMS';
      toast.error(msg);
    } finally {
      setSendingSms(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Lead not found.{' '}
        <Link href="/dashboard/leads" className="text-primary underline">
          Back to leads
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Leads
          </Button>
        </Link>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-xl font-bold tracking-tight">
          {lead.fullName ?? 'Unknown lead'}
        </h1>
        <span
          className={`ml-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOURS[lead.status] ?? 'bg-gray-100 text-gray-700'}`}
        >
          {lead.status}
        </span>
        <div className="ml-auto flex gap-2">
          {lead.phone && (
            <Button variant="outline" size="sm" onClick={() => setShowSms((v) => !v)}>
              <Send className="mr-1.5 h-4 w-4" />
              Send SMS
            </Button>
          )}
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={() => updateLead.mutate()} disabled={updateLead.isPending}>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                <X className="mr-1.5 h-3.5 w-3.5" />
                Cancel
              </Button>
            </>
          )}
          {lead.status !== 'ARCHIVED' && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => confirm('Archive this lead?') && archiveLead.mutate()}
            >
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* SMS compose panel */}
      {showSms && lead.phone && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-600" />
                Send SMS to {lead.phone}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowSms(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendSms} className="space-y-3">
              <textarea
                rows={3}
                value={smsBody}
                onChange={(e) => setSmsBody(e.target.value)}
                placeholder="Type your message here…"
                maxLength={1600}
                required
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{smsBody.length}/1600</span>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={sendingSms || !smsBody.trim()}>
                    {sendingSms ? 'Sending…' : 'Send SMS'}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowSms(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Contact card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Contact details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  {['NEW', 'QUALIFIED', 'CUSTOMER', 'ARCHIVED'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Notes</Label>
                <Input
                  value={editForm.notes}
                  onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Internal notes about this lead"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                ) : (
                  <span className="text-muted-foreground">No phone</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                ) : (
                  <span className="text-muted-foreground">No email</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground sm:col-span-2">
                <span className="font-medium text-foreground">Source:</span>{' '}
                {lead.source?.replace(/-/g, ' ') ?? 'Unknown'}
                {' · '}
                <span className="font-medium text-foreground">Added:</span>{' '}
                {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              {lead.notes && (
                <div className="sm:col-span-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                  {lead.notes}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* History tabs */}
      <Tabs defaultValue="conversations">
        <TabsList>
          <TabsTrigger value="conversations" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Conversations ({lead.conversations.length})
          </TabsTrigger>
          <TabsTrigger value="appointments" className="gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Appointments ({lead.appointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-4 space-y-3">
          {lead.conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No conversations yet.
            </p>
          ) : (
            lead.conversations.map((conv) => (
              <Card key={conv.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {conv.type === 'VOICE' ? '📞 Voice call' : '💬 Chat'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(conv.createdAt).toLocaleString('en-GB')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {conv.messages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No messages recorded.</p>
                  ) : (
                    conv.messages.slice(0, 6).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 text-sm ${
                          msg.senderLabel === 'user' || msg.senderLabel === 'caller'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-1.5 ${
                            msg.senderLabel === 'user' || msg.senderLabel === 'caller'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <p className="text-[10px] font-semibold uppercase opacity-60 mb-0.5">
                            {msg.senderLabel}
                          </p>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {conv.messages.length > 6 && (
                    <p className="text-xs text-muted-foreground text-center">
                      + {conv.messages.length - 6} more messages
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="appointments" className="mt-4 space-y-3">
          {lead.appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No appointments yet.{' '}
              <Link href="/dashboard/bookings" className="text-primary underline">
                Create one
              </Link>
            </p>
          ) : (
            lead.appointments.map((appt) => {
              const start = new Date(appt.startsAt);
              return (
                <Card key={appt.id}>
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {start.toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {start.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {appt.notes && ` · ${appt.notes}`}
                      </p>
                    </div>
                    <Badge variant={APPT_COLOURS[appt.status] ?? 'secondary'}>
                      {appt.status}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
