import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { sendSms, buildAppointmentConfirmationSms } from '../sms/sms.service';

const createAppointmentSchema = z.object({
  leadId: z.string().cuid().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  sendSmsConfirmation: z.boolean().default(true)
});

const updateAppointmentSchema = z.object({
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  sendSmsConfirmation: z.boolean().default(false)
});

const listAppointmentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.nativeEnum(AppointmentStatus).optional()
});

export async function listAppointments(businessId: string, rawQuery: unknown) {
  const query = listAppointmentsSchema.parse(rawQuery);
  const skip = (query.page - 1) * query.limit;

  const where = {
    businessId,
    ...(query.status ? { status: query.status } : {})
  };

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      skip,
      take: query.limit,
      include: {
        lead: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true
          }
        }
      }
    }),
    prisma.appointment.count({ where })
  ]);

  return { appointments, total, page: query.page, limit: query.limit };
}

export async function getAppointment(businessId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId },
    include: {
      lead: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true
        }
      }
    }
  });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  return appointment;
}

export async function createAppointment(
  businessId: string,
  rawInput: unknown
) {
  const input = createAppointmentSchema.parse(rawInput);

  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);

  if (endsAt <= startsAt) {
    throw new AppError('endsAt must be after startsAt', 400);
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { aiSettings: true }
  });

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  let lead = null;

  if (input.leadId) {
    lead = await prisma.lead.findFirst({
      where: { id: input.leadId, businessId }
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
  }

  const appointment = await prisma.appointment.create({
    data: {
      businessId,
      leadId: lead?.id ?? null,
      startsAt,
      endsAt,
      status: AppointmentStatus.CONFIRMED
    },
    include: {
      lead: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true
        }
      }
    }
  });

  // Send SMS confirmation if lead has a phone number
  if (input.sendSmsConfirmation && lead?.phone) {
    const timezone = business.aiSettings?.timezone ?? 'Europe/London';

    const smsBody = buildAppointmentConfirmationSms({
      businessName: business.name,
      leadName: lead.fullName,
      startsAt,
      timezone
    });

    await sendSms({
      businessId,
      toPhone: lead.phone,
      body: smsBody
    });
  }

  return appointment;
}

export async function updateAppointment(
  businessId: string,
  appointmentId: string,
  rawInput: unknown
) {
  const input = updateAppointmentSchema.parse(rawInput);

  const existing = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId },
    include: {
      lead: { select: { id: true, fullName: true, phone: true } }
    }
  });

  if (!existing) {
    throw new AppError('Appointment not found', 404);
  }

  const startsAt = input.startsAt ? new Date(input.startsAt) : existing.startsAt;
  const endsAt = input.endsAt ? new Date(input.endsAt) : existing.endsAt;

  if (endsAt <= startsAt) {
    throw new AppError('endsAt must be after startsAt', 400);
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      startsAt,
      endsAt,
      ...(input.status ? { status: input.status } : {})
    },
    include: {
      lead: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true
        }
      }
    }
  });

  // Re-send SMS if time changed and lead has a phone
  if (input.sendSmsConfirmation && existing.lead?.phone) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { aiSettings: true }
    });

    const timezone = business?.aiSettings?.timezone ?? 'Europe/London';

    const smsBody = buildAppointmentConfirmationSms({
      businessName: business?.name ?? 'Your tradesperson',
      leadName: existing.lead.fullName,
      startsAt,
      timezone
    });

    await sendSms({
      businessId,
      toPhone: existing.lead.phone,
      body: smsBody
    });
  }

  return updated;
}

export async function cancelAppointment(
  businessId: string,
  appointmentId: string
) {
  const existing = await prisma.appointment.findFirst({
    where: { id: appointmentId, businessId }
  });

  if (!existing) {
    throw new AppError('Appointment not found', 404);
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.CANCELLED }
  });
}

/*
 * Google Calendar integration stub.
 * When ready, install `googleapis` and implement OAuth2 + event creation here.
 * The `googleCalendarEventId` field on Appointment is ready to store the event ID.
 */
export async function syncToGoogleCalendar(
  _businessId: string,
  _appointmentId: string
): Promise<void> {
  // TODO: implement Google Calendar OAuth2 + event creation
  throw new AppError('Google Calendar integration is not yet configured', 501);
}
