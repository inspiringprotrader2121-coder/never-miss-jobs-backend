import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';

// Working hours shape: { mon: { open: "09:00", close: "17:00", enabled: true }, ... }
const workingDaySchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  close: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  enabled: z.boolean()
});

const workingHoursSchema = z.object({
  mon: workingDaySchema,
  tue: workingDaySchema,
  wed: workingDaySchema,
  thu: workingDaySchema,
  fri: workingDaySchema,
  sat: workingDaySchema,
  sun: workingDaySchema
});

const updateBusinessSchema = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  phoneNumber: z.string().min(5).optional(),
  country: z.string().optional()
});

const updateAiSettingsSchema = z.object({
  welcomeMessage: z.string().optional(),
  qualificationPrompt: z.string().optional(),
  afterHoursMessage: z.string().optional(),
  timezone: z.string().optional(),
  modelName: z.enum(['gpt-4.1-mini', 'gpt-4o', 'gpt-4o-mini']).optional(),
  workingHours: workingHoursSchema.optional()
});

export async function getBusiness(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      aiSettings: true,
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  return business;
}

export async function updateBusiness(businessId: string, rawInput: unknown) {
  const input = updateBusinessSchema.parse(rawInput);

  const existing = await prisma.business.findUnique({
    where: { id: businessId }
  });

  if (!existing) {
    throw new AppError('Business not found', 404);
  }

  return prisma.business.update({
    where: { id: businessId },
    data: input
  });
}

export async function getAiSettings(businessId: string) {
  const settings = await prisma.aiSettings.findUnique({
    where: { businessId }
  });

  if (!settings) {
    throw new AppError('AI settings not found', 404);
  }

  // Parse workingHoursJson back to object for the response
  return {
    ...settings,
    workingHours: settings.workingHoursJson
      ? (JSON.parse(settings.workingHoursJson) as z.infer<typeof workingHoursSchema>)
      : null
  };
}

export async function updateAiSettings(businessId: string, rawInput: unknown) {
  const input = updateAiSettingsSchema.parse(rawInput);

  const existing = await prisma.aiSettings.findUnique({
    where: { businessId }
  });

  if (!existing) {
    throw new AppError('AI settings not found', 404);
  }

  const { workingHours, ...rest } = input;

  return prisma.aiSettings.update({
    where: { businessId },
    data: {
      ...rest,
      ...(workingHours !== undefined
        ? { workingHoursJson: JSON.stringify(workingHours) }
        : {})
    }
  });
}

export function isWithinWorkingHours(
  workingHoursJson: string | null,
  timezone: string | null,
  now: Date = new Date()
): boolean {
  if (!workingHoursJson) return true;

  const tz = timezone ?? 'Europe/London';

  const dayName = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'short'
  })
    .format(now)
    .toLowerCase() as keyof z.infer<typeof workingHoursSchema>;

  const timeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);

  let hours: z.infer<typeof workingHoursSchema>;

  try {
    hours = workingHoursSchema.parse(JSON.parse(workingHoursJson));
  } catch {
    return true;
  }

  const day = hours[dayName];

  if (!day || !day.enabled) return false;

  return timeStr >= day.open && timeStr < day.close;
}
