import type { NextFunction, Request, Response } from 'express';
import * as businessService from './business.service';
import { prisma } from '../../config/prisma';

export async function getBusiness(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const business = await businessService.getBusiness(req.user.businessId);
    res.status(200).json(business);
  } catch (err) {
    next(err);
  }
}

export async function updateBusiness(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const business = await businessService.updateBusiness(
      req.user.businessId,
      req.body
    );

    res.status(200).json(business);
  } catch (err) {
    next(err);
  }
}

export async function getAiSettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const settings = await businessService.getAiSettings(req.user.businessId);
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const { businessId } = req.user;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOf30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOf7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalLeads,
      newLeadsToday,
      newLeads7d,
      totalAppointments,
      upcomingAppointments,
      totalConversations,
      conversations7d,
      missedCalls,
      subscription
    ] = await Promise.all([
      prisma.lead.count({ where: { businessId } }),
      prisma.lead.count({ where: { businessId, createdAt: { gte: startOfToday } } }),
      prisma.lead.count({ where: { businessId, createdAt: { gte: startOf7DaysAgo } } }),
      prisma.appointment.count({ where: { businessId } }),
      prisma.appointment.count({
        where: { businessId, status: 'CONFIRMED', startsAt: { gte: now } }
      }),
      prisma.conversation.count({ where: { businessId, type: 'CHAT' } }),
      prisma.conversation.count({
        where: { businessId, type: 'CHAT', createdAt: { gte: startOf7DaysAgo } }
      }),
      prisma.conversation.count({
        where: { businessId, type: 'VOICE', createdAt: { gte: startOf30DaysAgo } }
      }),
      prisma.subscription.findFirst({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        select: { status: true, planCode: true, trialEndsAt: true, currentPeriodEnd: true }
      })
    ]);

    res.json({
      leads: { total: totalLeads, today: newLeadsToday, last7Days: newLeads7d },
      appointments: { total: totalAppointments, upcoming: upcomingAppointments },
      conversations: { total: totalConversations, last7Days: conversations7d },
      missedCalls: { last30Days: missedCalls },
      subscription
    });
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const { businessId } = req.user;

    const now = new Date();
    const days = 30;
    const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Fetch raw rows with just the createdAt date
    const [leads, appointments, conversations] = await Promise.all([
      prisma.lead.findMany({
        where: { businessId, createdAt: { gte: since } },
        select: { createdAt: true }
      }),
      prisma.appointment.findMany({
        where: { businessId, createdAt: { gte: since } },
        select: { createdAt: true }
      }),
      prisma.conversation.findMany({
        where: { businessId, type: 'CHAT', createdAt: { gte: since } },
        select: { createdAt: true }
      })
    ]);

    // Build a day-keyed map for the last `days` days
    const dayMap: Record<string, { date: string; leads: number; appointments: number; chats: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dayMap[key] = { date: key, leads: 0, appointments: 0, chats: 0 };
    }

    for (const l of leads) {
      const k = l.createdAt.toISOString().slice(0, 10);
      if (dayMap[k]) dayMap[k].leads++;
    }
    for (const a of appointments) {
      const k = a.createdAt.toISOString().slice(0, 10);
      if (dayMap[k]) dayMap[k].appointments++;
    }
    for (const c of conversations) {
      const k = c.createdAt.toISOString().slice(0, 10);
      if (dayMap[k]) dayMap[k].chats++;
    }

    res.json({ days: Object.values(dayMap) });
  } catch (err) {
    next(err);
  }
}

export async function updateAiSettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const settings = await businessService.updateAiSettings(
      req.user.businessId,
      req.body
    );

    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}
