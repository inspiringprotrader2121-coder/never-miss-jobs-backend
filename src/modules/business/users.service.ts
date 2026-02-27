import { z } from 'zod';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';

const inviteUserSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([Role.ADMIN, Role.STAFF])
});

const updateUserRoleSchema = z.object({
  role: z.enum([Role.ADMIN, Role.STAFF])
});

export async function listUsers(businessId: string) {
  return prisma.user.findMany({
    where: { businessId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });
}

export async function inviteUser(businessId: string, rawInput: unknown) {
  const input = inviteUserSchema.parse(rawInput);

  const existing = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existing) {
    throw new AppError('A user with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.create({
    data: {
      businessId,
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: input.role
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
}

export async function updateUserRole(
  businessId: string,
  targetUserId: string,
  requestingUserId: string,
  rawInput: unknown
) {
  const input = updateUserRoleSchema.parse(rawInput);

  if (targetUserId === requestingUserId) {
    throw new AppError('You cannot change your own role', 400);
  }

  const target = await prisma.user.findFirst({
    where: { id: targetUserId, businessId }
  });

  if (!target) {
    throw new AppError('User not found', 404);
  }

  // Protect the OWNER account from being demoted
  if (target.role === Role.OWNER) {
    throw new AppError('The owner role cannot be changed', 403);
  }

  return prisma.user.update({
    where: { id: targetUserId },
    data: { role: input.role },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
}

export async function removeUser(
  businessId: string,
  targetUserId: string,
  requestingUserId: string
) {
  if (targetUserId === requestingUserId) {
    throw new AppError('You cannot remove yourself', 400);
  }

  const target = await prisma.user.findFirst({
    where: { id: targetUserId, businessId }
  });

  if (!target) {
    throw new AppError('User not found', 404);
  }

  if (target.role === Role.OWNER) {
    throw new AppError('The owner account cannot be removed', 403);
  }

  await prisma.user.delete({ where: { id: targetUserId } });
}
