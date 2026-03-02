import { z } from 'zod';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { sendEmail } from '../../config/mailer';
import { teamInviteEmailHtml } from '../../config/emailTemplates';
import { env } from '../../config/env';

const INVITE_EXPIRES_HOURS = 48;

const inviteUserSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  role: z.enum([Role.ADMIN, Role.STAFF])
});

const acceptInviteSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8)
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

export async function inviteUser(
  businessId: string,
  inviterUserId: string,
  rawInput: unknown
) {
  const input = inviteUserSchema.parse(rawInput);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('A user with this email already exists', 409);

  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) throw new AppError('Business not found', 404);

  const inviter = await prisma.user.findUnique({ where: { id: inviterUserId } });

  const inviteToken = crypto.randomBytes(32).toString('hex');
  const inviteTokenExpiresAt = new Date(Date.now() + INVITE_EXPIRES_HOURS * 60 * 60 * 1000);

  // Create user with a placeholder password hash — they will set their own via the invite link
  const placeholderHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);

  const user = await prisma.user.create({
    data: {
      businessId,
      fullName: input.fullName,
      email: input.email,
      passwordHash: placeholderHash,
      role: input.role,
      inviteToken,
      inviteTokenExpiresAt
    },
    select: { id: true, fullName: true, email: true, role: true, createdAt: true }
  });

  const frontendUrl = env.FRONTEND_URL ?? 'https://tradebooking.co.uk';
  const inviteUrl = `${frontendUrl}/accept-invite?token=${inviteToken}`;

  sendEmail({
    to: input.email,
    subject: `You have been invited to join ${business.name} on TradeBooking`,
    html: teamInviteEmailHtml({
      businessName: business.name,
      inviterName: inviter?.fullName ?? 'Your team owner',
      inviteUrl,
      role: input.role,
      expiresHours: INVITE_EXPIRES_HOURS
    })
  }).catch(() => {});

  return user;
}

export async function acceptInvite(rawInput: unknown) {
  const input = acceptInviteSchema.parse(rawInput);

  const user = await prisma.user.findFirst({
    where: {
      inviteToken: input.token,
      inviteTokenExpiresAt: { gt: new Date() }
    }
  });

  if (!user) throw new AppError('Invite link is invalid or has expired', 400);

  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      inviteToken: null,
      inviteTokenExpiresAt: null
    },
    select: { id: true, fullName: true, email: true, role: true }
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
