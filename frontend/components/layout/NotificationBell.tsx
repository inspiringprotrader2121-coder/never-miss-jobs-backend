'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Users, CalendarDays, PhoneMissed, X } from 'lucide-react';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'new_lead' | 'upcoming_appointment' | 'missed_call';
  title: string;
  description: string;
  createdAt: string;
  href: string;
}

const TYPE_ICON = {
  new_lead: Users,
  upcoming_appointment: CalendarDays,
  missed_call: PhoneMissed
};

const TYPE_COLOR = {
  new_lead: 'text-purple-600 bg-purple-100',
  upcoming_appointment: 'text-green-600 bg-green-100',
  missed_call: 'text-orange-600 bg-orange-100'
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/business/notifications').then((r) => r.data),
    refetchInterval: 30_000
  });

  const recentCount = notifications.filter(
    (n) => Date.now() - new Date(n.createdAt).getTime() < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {recentCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {recentCount > 9 ? '9+' : recentCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => {
                  const Icon = TYPE_ICON[n.type];
                  const color = TYPE_COLOR[n.type];
                  return (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b last:border-0"
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700">{n.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{n.description}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{timeAgo(n.createdAt)}</p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t px-4 py-2 text-center">
                <Badge variant="secondary" className="text-xs">
                  {notifications.length} recent events
                </Badge>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
