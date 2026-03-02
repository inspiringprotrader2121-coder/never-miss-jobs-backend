'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarPlus, X, Search } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  notes: string | null;
  lead: { id: string; fullName: string | null; phone: string | null } | null;
}

interface Lead {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
}

const STATUS_COLOUR: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  CONFIRMED: 'default',
  CANCELLED: 'destructive',
  NO_SHOW: 'outline'
};

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    startsAt: '',
    endsAt: '',
    leadId: '',
    notes: '',
    sendSmsConfirmation: true
  });
  const [leadSearch, setLeadSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);

  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['bookings', statusFilter],
    queryFn: () =>
      api
        .get('/bookings', { params: { limit: 50, status: statusFilter || undefined } })
        .then(({ data }) => data)
  });

  const { data: leadsData } = useQuery({
    queryKey: ['leads-search', leadSearch],
    queryFn: () =>
      api
        .get('/crm/leads', {
          params: { limit: 8, search: leadSearch || undefined }
        })
        .then(({ data }) => data),
    enabled: showLeadDropdown
  });

  const createBooking = useMutation({
    mutationFn: () =>
      api.post('/bookings', {
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
        leadId: form.leadId || undefined,
        notes: form.notes || undefined,
        sendSmsConfirmation: form.sendSmsConfirmation
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Appointment created');
      setShowForm(false);
      setForm({ startsAt: '', endsAt: '', leadId: '', notes: '', sendSmsConfirmation: true });
      setSelectedLead(null);
      setLeadSearch('');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Failed to create appointment');
    }
  });

  const cancelBooking = useMutation({
    mutationFn: (id: string) => api.patch(`/bookings/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Appointment cancelled');
    },
    onError: () => toast.error('Failed to cancel')
  });

  const appointments: Appointment[] = data?.appointments ?? [];
  const leads: Lead[] = leadsData?.leads ?? [];

  function selectLead(lead: Lead) {
    setSelectedLead(lead);
    setForm((f) => ({ ...f, leadId: lead.id }));
    setLeadSearch(lead.fullName ?? lead.phone ?? lead.id);
    setShowLeadDropdown(false);
  }

  function clearLead() {
    setSelectedLead(null);
    setForm((f) => ({ ...f, leadId: '' }));
    setLeadSearch('');
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total ?? 0} appointments total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No show</option>
          </select>
          <Button onClick={() => setShowForm((v) => !v)} size="sm">
            <CalendarPlus className="mr-2 h-4 w-4" />
            New appointment
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Book appointment</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => { e.preventDefault(); createBooking.mutate(); }}
            >
              <div className="space-y-1.5">
                <Label>Start time</Label>
                <Input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>End time</Label>
                <Input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                  required
                />
              </div>

              {/* Lead search dropdown */}
              <div className="space-y-1.5 sm:col-span-2 relative">
                <Label>Link to lead (optional)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 pr-8"
                    placeholder="Search by name, email or phone…"
                    value={leadSearch}
                    onChange={(e) => {
                      setLeadSearch(e.target.value);
                      setShowLeadDropdown(true);
                      if (!e.target.value) clearLead();
                    }}
                    onFocus={() => setShowLeadDropdown(true)}
                    autoComplete="off"
                  />
                  {selectedLead && (
                    <button
                      type="button"
                      onClick={clearLead}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {showLeadDropdown && leads.length > 0 && !selectedLead && (
                  <div className="absolute z-10 w-full mt-1 rounded-lg border bg-white shadow-lg">
                    {leads.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm border-b last:border-0"
                        onClick={() => selectLead(lead)}
                      >
                        <span className="font-medium">{lead.fullName ?? 'Unknown'}</span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          {lead.phone ?? lead.email ?? ''}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {selectedLead && (
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Linked to {selectedLead.fullName ?? selectedLead.phone}
                    {selectedLead.phone && form.sendSmsConfirmation && ' · SMS will be sent'}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Notes (optional)</Label>
                <Input
                  placeholder="Job details, address, etc."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sendSmsConfirmation}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sendSmsConfirmation: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Send SMS confirmation to lead
                </label>
                <Button type="submit" disabled={createBooking.isPending}>
                  {createBooking.isPending ? 'Booking…' : 'Create appointment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      No appointments yet. Click &quot;New appointment&quot; to create one.
                    </TableCell>
                  </TableRow>
                )
              : appointments.map((appt) => {
                  const start = new Date(appt.startsAt);
                  const end = new Date(appt.endsAt);
                  const mins = Math.round((end.getTime() - start.getTime()) / 60000);
                  return (
                    <TableRow key={appt.id}>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {start.toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {start.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {' – '}
                          {end.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {mins >= 60
                          ? `${Math.floor(mins / 60)}h${mins % 60 ? ` ${mins % 60}m` : ''}`
                          : `${mins}m`}
                      </TableCell>
                      <TableCell>
                        {appt.lead ? (
                          <div>
                            <div className="text-sm font-medium">
                              {appt.lead.fullName ?? 'Unknown'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {appt.lead.phone}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">
                        {appt.notes ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_COLOUR[appt.status] ?? 'secondary'}>
                          {appt.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {appt.status !== 'CANCELLED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              if (confirm('Cancel this appointment?')) {
                                cancelBooking.mutate(appt.id);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
