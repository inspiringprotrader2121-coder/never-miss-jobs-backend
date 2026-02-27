import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma';

/**
 * Blocks access if the business's subscription is CANCELED or PAST_DUE.
 * TRIALING and ACTIVE are allowed through.
 *
 * Apply after `authenticate` on any route that requires a paid/trial account.
 * Example: router.use(authenticate, requireActiveSubscription);
 */
export async function requireActiveSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthenticated' });
    return;
  }

  const subscription = await prisma.subscription.findFirst({
    where: { businessId: req.user.businessId },
    orderBy: { createdAt: 'desc' }
  });

  if (!subscription) {
    res.status(402).json({
      message: 'No active subscription found.',
      code: 'NO_SUBSCRIPTION'
    });
    return;
  }

  if (subscription.status === 'CANCELED') {
    res.status(402).json({
      message: 'Your subscription has been cancelled. Please resubscribe to continue.',
      code: 'SUBSCRIPTION_CANCELED'
    });
    return;
  }

  if (subscription.status === 'PAST_DUE') {
    res.status(402).json({
      message: 'Your payment is overdue. Please update your billing details.',
      code: 'SUBSCRIPTION_PAST_DUE'
    });
    return;
  }

  // Check trial expiry
  if (
    subscription.status === 'TRIALING' &&
    subscription.trialEndsAt &&
    subscription.trialEndsAt < new Date()
  ) {
    // Auto-update to CANCELED so future checks are faster
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELED' }
    }).catch(() => {});

    res.status(402).json({
      message: 'Your free trial has ended. Please subscribe to continue.',
      code: 'TRIAL_EXPIRED'
    });
    return;
  }

  next();
}
