import { google } from 'googleapis';
import { prisma } from '../../config/prisma';
import { getOAuth2Client, getAuthUrl } from '../../config/googleCalendar';
import { AppError } from '../../middleware/errorHandler';

/**
 * Returns the OAuth URL the business owner must visit to connect Google Calendar.
 * We embed the businessId in the state param so the callback knows who to save the token for.
 */
export function getCalendarAuthUrl(businessId: string): string {
  const base = getAuthUrl();
  const url = new URL(base);
  url.searchParams.set('state', businessId);
  return url.toString();
}

/**
 * Called by the OAuth callback route after Google redirects back.
 * Exchanges the code for tokens and saves the refresh token on the Business record.
 */
export async function handleCalendarOAuthCallback(
  code: string,
  businessId: string
): Promise<void> {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    throw new AppError(
      'No refresh token returned. Please revoke access in your Google account and try again.',
      400
    );
  }

  await prisma.business.update({
    where: { id: businessId },
    data: { googleRefreshToken: tokens.refresh_token }
  });
}

/**
 * Creates or updates a Google Calendar event for an appointment.
 * Stores the event ID back on the Appointment record.
 */
export async function syncAppointmentToCalendar(
  businessId: string,
  appointmentId: string
): Promise<string> {
  const business = await prisma.business.findUnique({
    where: { id: businessId }
  });

  if (!business?.googleRefreshToken) {
    throw new AppError(
      'Google Calendar is not connected. Visit /business/calendar/connect to authorise.',
      400
    );
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId },
    include: {
      lead: { select: { fullName: true, email: true, phone: true } }
    }
  });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const auth = getOAuth2Client(business.googleRefreshToken);
  const calendar = google.calendar({ version: 'v3', auth });

  const calendarId = business.googleCalendarId ?? 'primary';

  const eventBody = {
    summary: appointment.lead?.fullName
      ? `Appointment – ${appointment.lead.fullName}`
      : 'Appointment',
    description: appointment.lead?.phone
      ? `Phone: ${appointment.lead.phone}`
      : undefined,
    start: { dateTime: appointment.startsAt.toISOString() },
    end: { dateTime: appointment.endsAt.toISOString() },
    attendees: appointment.lead?.email
      ? [{ email: appointment.lead.email }]
      : undefined,
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 60 },
        { method: 'popup', minutes: 30 }
      ]
    }
  };

  let eventId: string;

  if (appointment.googleCalendarEventId) {
    // Update existing event
    const res = await calendar.events.update({
      calendarId,
      eventId: appointment.googleCalendarEventId,
      requestBody: eventBody
    });
    eventId = res.data.id!;
  } else {
    // Create new event
    const res = await calendar.events.insert({
      calendarId,
      requestBody: eventBody
    });
    eventId = res.data.id!;
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { googleCalendarEventId: eventId }
  });

  return eventId;
}

/**
 * Deletes the Google Calendar event when an appointment is cancelled.
 */
export async function deleteCalendarEvent(
  businessId: string,
  appointmentId: string
): Promise<void> {
  const business = await prisma.business.findUnique({
    where: { id: businessId }
  });

  if (!business?.googleRefreshToken) return;

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId }
  });

  if (!appointment?.googleCalendarEventId) return;

  const auth = getOAuth2Client(business.googleRefreshToken);
  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = business.googleCalendarId ?? 'primary';

  await calendar.events
    .delete({ calendarId, eventId: appointment.googleCalendarEventId })
    .catch(() => {
      // Non-fatal: event may have already been deleted manually
    });
}

export function isCalendarConnected(business: { googleRefreshToken: string | null }): boolean {
  return !!business.googleRefreshToken;
}
