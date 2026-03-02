import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';

// ─── Schemas ─────────────────────────────────────────────────────────────────

const serviceSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1).max(100),
  durationMinutes: z.number().int().min(15).max(480).default(60),
  depositRequired: z.boolean().default(false),
  depositAmount: z.number().int().min(0).optional().nullable()
});

const updateSetupSchema = z.object({
  step: z.number().int().min(1).max(7),

  // Step 1 — Business profile
  name: z.string().min(1).max(200).optional(),
  industry: z.string().optional(),
  phoneNumber: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  staffCount: z.number().int().min(1).optional(),
  callsPerDay: z.number().int().min(0).optional(),
  averageJobValue: z.number().int().min(0).optional(),
  emergencyServiceEnabled: z.boolean().optional(),

  // Step 2 — Services
  services: z.array(serviceSchema).optional(),

  // Step 3 — Working hours
  openingHours: z.string().optional(),
  closingHours: z.string().optional(),
  weekendEnabled: z.boolean().optional(),

  // Step 5 — Phone / Twilio number (stored on business)
  twilioNumber: z.string().optional()
});

export type UpdateSetupInput = z.infer<typeof updateSetupSchema>;

// ─── Service functions ────────────────────────────────────────────────────────

export async function getSetupStatus(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      name: true,
      industry: true,
      phoneNumber: true,
      websiteUrl: true,
      staffCount: true,
      callsPerDay: true,
      averageJobValue: true,
      emergencyServiceEnabled: true,
      openingHours: true,
      closingHours: true,
      weekendEnabled: true,
      onboardingStep: true,
      onboardingComplete: true,
      services: {
        select: {
          id: true,
          name: true,
          durationMinutes: true,
          depositRequired: true,
          depositAmount: true
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!business) throw new AppError('Business not found', 404);
  return business;
}

export async function updateSetup(businessId: string, rawInput: unknown) {
  const input = updateSetupSchema.parse(rawInput);

  // Advance step only if moving forward
  const current = await prisma.business.findUnique({
    where: { id: businessId },
    select: { onboardingStep: true }
  });

  if (!current) throw new AppError('Business not found', 404);

  const nextStep = Math.max(current.onboardingStep, input.step + 1);

  // Build business update payload
  const businessData: Record<string, unknown> = {
    onboardingStep: Math.min(nextStep, 7)
  };

  if (input.name !== undefined) businessData['name'] = input.name;
  if (input.industry !== undefined) businessData['industry'] = input.industry;
  if (input.phoneNumber !== undefined) businessData['phoneNumber'] = input.phoneNumber;
  if (input.websiteUrl !== undefined) businessData['websiteUrl'] = input.websiteUrl || null;
  if (input.staffCount !== undefined) businessData['staffCount'] = input.staffCount;
  if (input.callsPerDay !== undefined) businessData['callsPerDay'] = input.callsPerDay;
  if (input.averageJobValue !== undefined) businessData['averageJobValue'] = input.averageJobValue;
  if (input.emergencyServiceEnabled !== undefined) businessData['emergencyServiceEnabled'] = input.emergencyServiceEnabled;
  if (input.openingHours !== undefined) businessData['openingHours'] = input.openingHours;
  if (input.closingHours !== undefined) businessData['closingHours'] = input.closingHours;
  if (input.weekendEnabled !== undefined) businessData['weekendEnabled'] = input.weekendEnabled;

  await prisma.business.update({
    where: { id: businessId },
    data: businessData
  });

  // Handle services upsert (step 2)
  if (input.services !== undefined) {
    // Delete services not in the submitted list
    const submittedIds = input.services
      .filter((s) => s.id)
      .map((s) => s.id as string);

    await prisma.service.deleteMany({
      where: {
        businessId,
        ...(submittedIds.length > 0 ? { id: { notIn: submittedIds } } : {})
      }
    });

    // Upsert each service
    for (const svc of input.services) {
      if (svc.id) {
        await prisma.service.update({
          where: { id: svc.id },
          data: {
            name: svc.name,
            durationMinutes: svc.durationMinutes,
            depositRequired: svc.depositRequired,
            depositAmount: svc.depositAmount ?? null
          }
        });
      } else {
        await prisma.service.create({
          data: {
            businessId,
            name: svc.name,
            durationMinutes: svc.durationMinutes,
            depositRequired: svc.depositRequired,
            depositAmount: svc.depositAmount ?? null
          }
        });
      }
    }
  }

  return getSetupStatus(businessId);
}

export async function completeSetup(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { onboardingStep: true, name: true }
  });

  if (!business) throw new AppError('Business not found', 404);

  return prisma.business.update({
    where: { id: businessId },
    data: {
      onboardingComplete: true,
      onboardingStep: 7
    },
    select: {
      id: true,
      name: true,
      onboardingComplete: true,
      onboardingStep: true
    }
  });
}
