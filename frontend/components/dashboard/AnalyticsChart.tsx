'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface DayData {
  date: string;
  leads: number;
  appointments: number;
  chats: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function AnalyticsChart() {
  const { data, isLoading } = useQuery<{ days: DayData[] }>({
    queryKey: ['analytics'],
    queryFn: () => api.get('/business/analytics').then(({ data }) => data),
    staleTime: 5 * 60 * 1000
  });

  if (isLoading) {
    return <Skeleton className="h-56 w-full rounded-xl" />;
  }

  const days = data?.days ?? [];

  // Show every ~5th label to avoid crowding
  const tickInterval = Math.floor(days.length / 6);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={days} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gAppts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gChats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          interval={tickInterval}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          labelFormatter={(v) => formatDate(v as string)}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            fontSize: 12
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Area
          type="monotone"
          dataKey="leads"
          name="Leads"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#gLeads)"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="appointments"
          name="Appointments"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#gAppts)"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="chats"
          name="AI chats"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#gChats)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
