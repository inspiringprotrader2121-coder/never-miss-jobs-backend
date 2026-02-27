'use client';

import { useState, Fragment } from 'react';
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
import { Phone, PhoneMissed, Clock, FileText } from 'lucide-react';

interface VoiceMessage {
  id: string;
  senderLabel: string;
  content: string;
  createdAt: string;
}

interface VoiceConversation {
  id: string;
  fromNumber: string | null;
  toNumber: string | null;
  isAfterHours: boolean;
  createdAt: string;
  endedAt: string | null;
  lead: { id: string; fullName: string | null; phone: string | null } | null;
  messages: VoiceMessage[];
}

interface VoiceLogsResponse {
  conversations: VoiceConversation[];
  total: number;
  page: number;
  limit: number;
}

interface VoiceStats {
  total: number;
  afterHours: number;
  withTranscript: number;
}

export default function VoicePage() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const limit = 20;

  const { data, isLoading } = useQuery<VoiceLogsResponse>({
    queryKey: ['voice-logs', page],
    queryFn: async () => {
      const res = await api.get(`/voice/logs?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const { data: stats } = useQuery<VoiceStats>({
    queryKey: ['voice-stats'],
    queryFn: async () => {
      const res = await api.get('/voice/stats');
      return res.data;
    }
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Voice & Missed Calls</h1>
        <p className="text-muted-foreground">
          Missed call capture, voicemails, and transcripts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">After Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.afterHours ?? '—'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">With Transcript</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.withTranscript ?? '—'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneMissed className="h-5 w-5" />
            Call Log
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
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !data?.conversations.length ? (
            <div className="py-12 text-center text-muted-foreground">
              <PhoneMissed className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>No voice calls yet.</p>
              <p className="mt-1 text-xs">
                Configure your Twilio number to point to{' '}
                <code className="rounded bg-muted px-1">
                  POST /voice/incoming/YOUR_BUSINESS_ID
                </code>
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caller</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>After Hours</TableHead>
                    <TableHead>Transcript</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.conversations.map((call) => {
                    const transcript = call.messages.find(
                      (m) => m.senderLabel === 'caller'
                    );
                    return (
                      <Fragment key={call.id}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            setExpanded(expanded === call.id ? null : call.id)
                          }
                        >
                          <TableCell className="font-mono text-sm">
                            {call.fromNumber ?? 'Unknown'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {call.lead?.fullName ?? (
                              <span className="text-muted-foreground">New lead</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(call.createdAt).toLocaleString('en-GB')}
                          </TableCell>
                          <TableCell>
                            {call.isAfterHours ? (
                              <Badge variant="outline" className="text-orange-600 border-orange-300">
                                After hours
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-300">
                                Working hours
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {transcript ? (
                              <Badge className="bg-blue-100 text-blue-800">
                                Transcribed
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              {expanded === call.id ? 'Hide' : 'View'}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expanded === call.id && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/30 p-4">
                              <div className="space-y-2">
                                {call.messages.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    No messages recorded.
                                  </p>
                                ) : (
                                  call.messages.map((msg) => (
                                    <div
                                      key={msg.id}
                                      className="rounded border bg-background p-3"
                                    >
                                      <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                                        {msg.senderLabel}
                                      </p>
                                      <p className="text-sm">{msg.content}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
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

