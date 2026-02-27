import { SmsDirection, SmsStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { getTwilioClient } from '../../config/twilio';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';

interface SendSmsOptions {
  businessId: string;
  toPhone: string;
  body: string;
}

export async function sendSms(options: SendSmsOptions): Promise<void> {
  const { businessId, toPhone, body } = options;

  if (!env.TWILIO_FROM_NUMBER) {
    throw new AppError('TWILIO_FROM_NUMBER is not configured', 500);
  }

  const twilio = getTwilioClient();

  let providerMessageId: string | undefined;
  let status: SmsStatus = SmsStatus.QUEUED;
  let errorMessage: string | undefined;

  try {
    const message = await twilio.messages.create({
      from: env.TWILIO_FROM_NUMBER,
      to: toPhone,
      body
    });

    providerMessageId = message.sid;
    status = SmsStatus.SENT;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Unknown Twilio error';
    status = SmsStatus.FAILED;
  }

  await prisma.smsLog.create({
    data: {
      businessId,
      toPhone,
      fromPhone: env.TWILIO_FROM_NUMBER,
      body,
      status,
      direction: SmsDirection.OUTBOUND,
      providerMessageId,
      errorMessage
    }
  });

  if (status === SmsStatus.FAILED) {
    throw new AppError(`SMS failed to send: ${errorMessage}`, 502);
  }
}

export async function getSmsLogs(businessId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.smsLog.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.smsLog.count({ where: { businessId } })
  ]);

  return { logs, total, page, limit };
}

export function buildAppointmentConfirmationSms(params: {
  businessName: string;
  leadName: string | null;
  startsAt: Date;
  timezone: string;
}): string {
  const { businessName, leadName, startsAt, timezone } = params;

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(startsAt);

  const name = leadName ? `, ${leadName}` : '';

  return `Hi${name}, your appointment with ${businessName} is confirmed for ${formattedDate}. Reply STOP to opt out.`;
}
