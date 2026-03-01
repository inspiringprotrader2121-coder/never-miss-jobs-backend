'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  Settings,
  LogOut,
  Zap,
  Phone,
  UserCog,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/sms', label: 'SMS Logs', icon: Smartphone },
  { href: '/dashboard/voice', label: 'Voice & Calls', icon: Phone },
  { href: '/dashboard/team', label: 'Team', icon: UserCog },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings }
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 text-slate-100 border-r border-slate-800">
      <div className="flex items-center gap-2 px-6 py-5">
        <Zap className="h-6 w-6 text-blue-400" />
        <span className="text-xl font-bold tracking-tight">TradeBooking</span>
      </div>

      <Separator className="bg-slate-800" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-slate-800" />

      <div className="px-4 py-4 space-y-2">
        <p className="px-3 text-xs text-slate-500 truncate">{user?.role}</p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
