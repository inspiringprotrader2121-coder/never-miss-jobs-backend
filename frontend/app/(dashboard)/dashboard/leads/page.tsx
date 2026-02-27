'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, UserCheck, UserX, Archive, CalendarPlus, X, Eye } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Lead {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  source: string | null;
  createdAt: string;
  _count: { conversations: number; appointments: number };
}

const statusColour: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  NEW: 'default',
  QUALIFIED: 'secondary',
  CUSTOMER: 'outline',
  ARCHIVED: 'destructive'
};

interface BookingLead {
  id: string;
  fullName: string | null;
}

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [bookingLead, setBookingLead] = useState<BookingLead | null>(null);
  const [bookForm, setBookForm] = useState({ startsAt: '', endsAt: '', sendSms: true });
  const [bookLoading, setBookLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, search],
    queryFn: () =>
      api
        .get('/crm/leads', { params: { page, limit: 20, search: search || undefined } })
        .then(({ data }) => data)
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/crm/leads/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated');
    },
    onError: () => toast.error('Failed to update lead')
  });

  const archiveLead = useMutation({
    mutationFn: (id: string) => api.delete(`/crm/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead archived');
    },
    onError: () => toast.error('Failed to archive lead')
  });

  async function handleQuickBook(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingLead) return;
    setBookLoading(true);
    try {
      await api.post('/bookings', {
        leadId: bookingLead.id,
        startsAt: new Date(bookForm.startsAt).toISOString(),
        endsAt: new Date(bookForm.endsAt).toISOString(),
        sendSmsConfirmation: bookForm.sendSms
      });
      toast.success(`Appointment booked for ${bookingLead.fullName ?? 'lead'}`);
      setBookingLead(null);
      setBookForm({ startsAt: '', endsAt: '', sendSms: true });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to book appointment';
      toast.error(msg);
    } finally {
      setBookLoading(false);
    }
  }

  const leads: Lead[] = data?.leads ?? [];
  const total: number = data?.total ?? 0;

  return (
    <div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, phone…"
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{total} leads</span>
        </div>

        {/* Quick-book modal */}
        {bookingLead && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarPlus className="h-4 w-4 text-blue-600" />
                  Book appointment for {bookingLead.fullName ?? 'lead'}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setBookingLead(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuickBook} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Start time</Label>
                  <Input
                    type="datetime-local"
                    value={bookForm.startsAt}
                    onChange={(e) => setBookForm((f) => ({ ...f, startsAt: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End time</Label>
                  <Input
                    type="datetime-local"
                    value={bookForm.endsAt}
                    onChange={(e) => setBookForm((f) => ({ ...f, endsAt: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <input
                    id="send-sms"
                    type="checkbox"
                    checked={bookForm.sendSms}
                    onChange={(e) => setBookForm((f) => ({ ...f, sendSms: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="send-sms" className="cursor-pointer font-normal">
                    Send SMS confirmation to lead
                  </Label>
                </div>
                <div className="flex gap-2 sm:col-span-2">
                  <Button type="submit" disabled={bookLoading}>
                    {bookLoading ? 'Booking…' : 'Confirm booking'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setBookingLead(null)}>
                    Cancel
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
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Added</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead.fullName ?? <span className="text-muted-foreground italic">Unknown</span>}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{lead.email}</div>
                        <div className="text-xs text-muted-foreground">{lead.phone}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColour[lead.status] ?? 'secondary'}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">
                        {lead.source?.replace(/-/g, ' ') ?? '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lead._count.conversations} chats · {lead._count.appointments} appts
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">•••</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/leads/${lead.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setBookingLead({ id: lead.id, fullName: lead.fullName })}
                            >
                              <CalendarPlus className="mr-2 h-4 w-4 text-blue-600" /> Book appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus.mutate({ id: lead.id, status: 'QUALIFIED' })}
                            >
                              <UserCheck className="mr-2 h-4 w-4" /> Mark Qualified
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateStatus.mutate({ id: lead.id, status: 'CUSTOMER' })}
                            >
                              <UserX className="mr-2 h-4 w-4" /> Mark Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => archiveLead.mutate(lead.id)}
                            >
                              <Archive className="mr-2 h-4 w-4" /> Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {total > 20 && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


