import bcrypt from 'bcrypt';
import { z } from 'zod';
import { Role, SubscriptionStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { AppError } from '../../middleware/errorHandler';
import { signAuthToken } from './auth.jwt';

const registerSchema = z.object({
  businessName: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function register(input: unknown) {
  const data = registerSchema.parse(input);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: data.businessName
      }
    });

    const user = await tx.user.create({
      data: {
        businessId: business.id,
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        role: Role.OWNER
      }
    });

    await tx.aiSettings.create({
      data: {
        businessId: business.id,
        welcomeMessage:
          'Hi, thanks for contacting us via TradeBooking. How can we help with your job today?'
      }
    });

    await tx.subscription.create({
      data: {
        businessId: business.id,
        status: SubscriptionStatus.TRIALING,
        planCode: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    return { business, user };
  });

  const token = signAuthToken({
    userId: result.user.id,
    businessId: result.business.id,
    role: result.user.role
  });

  return {
    token
  };
}

export async function login(input: unknown) {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = signAuthToken({
    userId: user.id,
    businessId: user.businessId,
    role: user.role
  });

  return {
    token
  };
}

