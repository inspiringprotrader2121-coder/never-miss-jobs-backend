import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import {
  getCalendarAuthUrl,
  handleCalendarOAuthCallback,
  isCalendarConnected
} from './calendar.service';

/** GET /business/calendar/connect — returns the Google OAuth URL */
export async function getConnectUrl(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const url = getCalendarAuthUrl(req.user.businessId);
    res.json({ url });
  } catch (err) {
    next(err);
  }
}

/** GET /business/calendar/callback — Google redirects here after consent */
export async function oauthCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, state: businessId } = req.query as { code: string; state: string };
    if (!code || !businessId) {
      res.status(400).json({ message: 'Missing code or state' });
      return;
    }
    await handleCalendarOAuthCallback(code, businessId);
    // Redirect back to settings page
    res.redirect(`${process.env['APP_URL'] ?? 'https://app.tradebooking.co.uk'}/dashboard/settings?calendar=connected`);
  } catch (err) {
    next(err);
  }
}

/** GET /business/calendar/status — is Google Calendar connected? */
export async function getCalendarStatus(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
      select: { googleRefreshToken: true, googleCalendarId: true }
    });
    res.json({
      connected: isCalendarConnected({ googleRefreshToken: business?.googleRefreshToken ?? null }),
      calendarId: business?.googleCalendarId ?? 'primary'
    });
  } catch (err) {
    next(err);
  }
}

/** DELETE /business/calendar/disconnect — revoke and remove token */
export async function disconnectCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    await prisma.business.update({
      where: { id: req.user.businessId },
      data: { googleRefreshToken: null }
    });
    res.json({ message: 'Google Calendar disconnected' });
  } catch (err) {
    next(err);
  }
}
