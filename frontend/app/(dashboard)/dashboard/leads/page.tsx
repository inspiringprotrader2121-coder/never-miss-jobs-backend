'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, UserCheck, UserX, Archive } from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['leads', page, search],
    queryFn: () =>
      api
        .get('/crm/leads', { params: { page, limit: 20, search: search || undefined } })
        .then((r) => r.data)
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

  const leads: Lead[] = data?.leads ?? [];
  const total: number = data?.total ?? 0;

  return (
    <div>
      <Header title="Leads" />
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
