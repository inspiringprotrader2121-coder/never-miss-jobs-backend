'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface SmsLog {
  id: string;
  toPhone: string;
  fromPhone: string;
  body: string;
  status: string;
  direction: 'INBOUND' | 'OUTBOUND';
  createdAt: string;
}

interface SmsLogsResponse {
  logs: SmsLog[];
  total: number;
  page: number;
  limit: number;
}

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-800',
  SENT: 'bg-blue-100 text-blue-800',
  QUEUED: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800'
};

export default function SmsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery<SmsLogsResponse>({
    queryKey: ['sms-logs', page],
    queryFn: async () => {
      const res = await api.get(`/sms/logs?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SMS Logs</h1>
        <p className="text-muted-foreground">
          All inbound and outbound text messages for your business.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
            {data && (
              <Badge variant="secondary" className="ml-auto">
                {data.total} total
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !data?.logs.length ? (
            <div className="py-12 text-center text-muted-foreground">
              No SMS messages yet. Messages will appear here once you start
              sending or receiving texts.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Direction</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {log.direction === 'INBOUND' ? (
                          <span className="flex items-center gap-1 text-blue-600">
                            <ArrowDownLeft className="h-4 w-4" />
                            Inbound
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600">
                            <ArrowUpRight className="h-4 w-4" />
                            Outbound
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.fromPhone}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.toPhone}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm">
                        {log.body}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[log.status] ?? 'bg-gray-100 text-gray-800'}`}
                        >
                          {log.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString('en-GB')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

