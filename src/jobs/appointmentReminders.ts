import cron from 'node-cron';
import { prisma } from '../config/prisma';
import { sendSms } from '../modules/sms/sms.service';

/**
 * Runs every 15 minutes.
 * Finds appointments starting in the next 24 hours that haven't had a reminder sent,
 * sends an SMS to the lead, and marks the reminder as sent.
 */
export function startAppointmentReminderJob() {
  cron.schedule('*/15 * * * *', async () => {
    try {
      await sendUpcomingReminders();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ReminderJob] Error:', err);
    }
  });

  // eslint-disable-next-line no-console
  console.log('[ReminderJob] Appointment reminder scheduler started (every 15 min)');
}

async function sendUpcomingReminders() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000); // window: 23–24h out

  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'CONFIRMED',
      reminderSentAt: null,
      startsAt: { gte: in23h, lte: in24h }
    },
    include: {
      lead: { select: { fullName: true, phone: true } },
      business: {
        select: {
          name: true,
          aiSettings: { select: { timezone: true } }
        }
      }
    }
  });

  for (const appt of appointments) {
    if (!appt.lead?.phone) continue;

    const timezone = appt.business.aiSettings?.timezone ?? 'Europe/London';
    const formattedTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(appt.startsAt);

    const name = appt.lead.fullName ? ` ${appt.lead.fullName.split(' ')[0]}` : '';
    const body =
      `Hi${name}, this is a reminder that your appointment with ${appt.business.name} ` +
      `is tomorrow at ${formattedTime}. ` +
      `Reply STOP to opt out.`;

    try {
      await sendSms({
        businessId: appt.businessId,
        toPhone: appt.lead.phone,
        body
      });

      await prisma.appointment.update({
        where: { id: appt.id },
        data: { reminderSentAt: new Date() }
      });

      // eslint-disable-next-line no-console
      console.log(`[ReminderJob] Sent reminder for appointment ${appt.id}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[ReminderJob] Failed to send reminder for ${appt.id}:`, err);
    }
  }
}
