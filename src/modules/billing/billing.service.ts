import { z } from 'zod';
import { SubscriptionStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { getStripeClient } from '../../config/stripe';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';

const createCheckoutSessionSchema = z.object({
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

interface UserContext {
  userId: string;
  businessId: string;
}

export async function getCurrentSubscription(businessId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { businessId },
    orderBy: { createdAt: 'desc' }
  });

  return subscription;
}

export async function createCheckoutSession(
  user: UserContext,
  rawInput: unknown
) {
  const input = createCheckoutSessionSchema.parse(rawInput);

  if (!env.STRIPE_PRICE_ID) {
    throw new AppError('Stripe price is not configured', 500);
  }

  const stripe = getStripeClient();

  const business = await prisma.business.findUnique({
    where: { id: user.businessId }
  });

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  let customerId = business.stripeCustomerId ?? undefined;

  if (!customerId) {
    const ownerUser = await prisma.user.findFirst({
      where: {
        businessId: business.id,
        role: 'OWNER'
      }
    });

    const customer = await stripe.customers.create({
      name: business.name,
      email: ownerUser?.email,
      metadata: {
        businessId: business.id
      }
    });

    customerId = customer.id;

    await prisma.business.update({
      where: { id: business.id },
      data: {
        stripeCustomerId: customerId
      }
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      businessId: business.id,
      planCode: 'standard'
    },
    subscription_data: {
      metadata: {
        businessId: business.id,
        planCode: 'standard'
      }
    }
  });

  if (!session.url) {
    throw new AppError('Failed to create Stripe checkout session URL', 500);
  }

  return {
    url: session.url
  };
}

const portalSchema = z.object({
  returnUrl: z.string().url()
});

export async function createPortalSession(
  user: UserContext,
  rawInput: unknown
) {
  const input = portalSchema.parse(rawInput);
  const stripe = getStripeClient();

  const business = await prisma.business.findUnique({
    where: { id: user.businessId }
  });

  if (!business?.stripeCustomerId) {
    throw new AppError('No active billing account found. Please subscribe first.', 400);
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: business.stripeCustomerId,
    return_url: input.returnUrl
  });

  return { url: session.url };
}

