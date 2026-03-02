import { z } from 'zod';
import { LeadStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';

const listLeadsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.nativeEnum(LeadStatus).optional(),
  search: z.string().optional()
});

const createLeadSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
  notes: z.string().optional(),
  source: z.string().optional()
});

const updateLeadSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  notes: z.string().optional(),
  source: z.string().optional()
});

export async function createLead(businessId: string, rawInput: unknown) {
  const input = createLeadSchema.parse(rawInput);
  return prisma.lead.create({
    data: {
      businessId,
      fullName: input.fullName ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
      source: input.source ?? 'manual',
      status: LeadStatus.NEW
    }
  });
}

export async function listLeads(businessId: string, rawQuery: unknown) {
  const query = listLeadsSchema.parse(rawQuery);
  const skip = (query.page - 1) * query.limit;

  const where = {
    businessId,
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { fullName: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
            { phone: { contains: query.search } }
          ]
        }
      : {})
  };

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
      include: {
        _count: {
          select: {
            conversations: true,
            appointments: true
          }
        }
      }
    }),
    prisma.lead.count({ where })
  ]);

  return { leads, total, page: query.page, limit: query.limit };
}

export async function getLead(businessId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, businessId },
    include: {
      conversations: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20
          }
        }
      },
      appointments: {
        orderBy: { startsAt: 'desc' },
        take: 5
      }
    }
  });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
}

export async function updateLead(
  businessId: string,
  leadId: string,
  rawInput: unknown
) {
  const input = updateLeadSchema.parse(rawInput);

  const existing = await prisma.lead.findFirst({
    where: { id: leadId, businessId }
  });

  if (!existing) {
    throw new AppError('Lead not found', 404);
  }

  return prisma.lead.update({
    where: { id: leadId },
    data: input
  });
}

export async function deleteLead(businessId: string, leadId: string) {
  const existing = await prisma.lead.findFirst({
    where: { id: leadId, businessId }
  });

  if (!existing) {
    throw new AppError('Lead not found', 404);
  }

  // Soft-delete by archiving rather than hard delete to preserve conversation history
  return prisma.lead.update({
    where: { id: leadId },
    data: { status: LeadStatus.ARCHIVED }
  });
}
