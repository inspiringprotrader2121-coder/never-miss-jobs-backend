import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/prisma';

/**
 * Returns the 20 most recent notable events across leads, appointments,
 * and missed calls for the business — used to power the notification bell.
 */
export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const { businessId } = req.user;

    const [newLeads, upcomingAppts, missedCalls] = await Promise.all([
      prisma.lead.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, fullName: true, phone: true, source: true, createdAt: true }
      }),
      prisma.appointment.findMany({
        where: {
          businessId,
          status: 'CONFIRMED',
          startsAt: { gte: new Date() }
        },
        orderBy: { startsAt: 'asc' },
        take: 5,
        include: { lead: { select: { fullName: true } } }
      }),
      prisma.conversation.findMany({
        where: { businessId, type: 'VOICE' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, fromNumber: true, isAfterHours: true, createdAt: true }
      })
    ]);

    type Notification = {
      id: string;
      type: 'new_lead' | 'upcoming_appointment' | 'missed_call';
      title: string;
      description: string;
      createdAt: string;
      href: string;
    };

    const notifications: Notification[] = [
      ...newLeads.map((l) => ({
        id: `lead-${l.id}`,
        type: 'new_lead' as const,
        title: 'New lead',
        description: l.fullName ?? l.phone ?? 'Unknown contact',
        createdAt: l.createdAt.toISOString(),
        href: '/dashboard/leads'
      })),
      ...upcomingAppts.map((a) => ({
        id: `appt-${a.id}`,
        type: 'upcoming_appointment' as const,
        title: 'Upcoming appointment',
        description: `${a.lead?.fullName ?? 'Unknown'} — ${new Intl.DateTimeFormat('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(a.startsAt)}`,
        createdAt: a.createdAt.toISOString(),
        href: '/dashboard/bookings'
      })),
      ...missedCalls.map((c) => ({
        id: `call-${c.id}`,
        type: 'missed_call' as const,
        title: c.isAfterHours ? 'After-hours call' : 'Missed call',
        description: c.fromNumber ?? 'Unknown number',
        createdAt: c.createdAt.toISOString(),
        href: '/dashboard/voice'
      }))
    ];

    // Sort by most recent first
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(notifications.slice(0, 20));
  } catch (err) {
    next(err);
  }
}
