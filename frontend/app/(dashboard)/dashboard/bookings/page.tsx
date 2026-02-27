'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarPlus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface Appointment {
  id: string;
  startsAt: string;
  endsAt: string;
  status: string;
  lead: { id: string; fullName: string | null; phone: string | null } | null;
}

const statusColour: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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
    sendSmsConfirmation: true
  });

  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.get('/bookings?limit=50').then(({ data }) => data)
  });

  const createBooking = useMutation({
    mutationFn: () => api.post('/bookings', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Appointment created and SMS sent');
      setShowForm(false);
      setForm({ startsAt: '', endsAt: '', leadId: '', sendSmsConfirmation: true });
    },
    onError: () => toast.error('Failed to create appointment')
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

  return (
    <div>
      <Header title="Bookings" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} appointments</p>
          <Button onClick={() => setShowForm((v) => !v)} size="sm">
            <CalendarPlus className="mr-2 h-4 w-4" />
            New appointment
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
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
                <div className="space-y-1">
                  <Label>Start time</Label>
                  <Input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value + ':00Z' }))}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>End time</Label>
                  <Input
                    type="datetime-local"
                    value={form.endsAt}
                    onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value + ':00Z' }))}
                    required
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Lead ID (optional)</Label>
                  <Input
                    placeholder="Paste lead ID to link and send SMS"
                    value={form.leadId}
                    onChange={(e) => setForm((f) => ({ ...f, leadId: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" disabled={createBooking.isPending}>
                    {createBooking.isPending ? 'Booking…' : 'Create & send SMS'}
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
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : appointments.map((appt) => {
                    const start = new Date(appt.startsAt);
                    const end = new Date(appt.endsAt);
                    const mins = Math.round((end.getTime() - start.getTime()) / 60000);
                    return (
                      <TableRow key={appt.id}>
                        <TableCell>
                          <div className="font-medium">
                            {start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`}
                        </TableCell>
                        <TableCell>
                          {appt.lead ? (
                            <div>
                              <div className="text-sm font-medium">{appt.lead.fullName ?? 'Unknown'}</div>
                              <div className="text-xs text-muted-foreground">{appt.lead.phone}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusColour[appt.status] ?? 'secondary'}>
                            {appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {appt.status !== 'CANCELLED' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => cancelBooking.mutate(appt.id)}
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
    </div>
  );
}

