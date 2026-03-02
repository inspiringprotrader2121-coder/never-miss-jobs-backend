import type { Request, Response } from 'express';
import type Stripe from 'stripe';
import { SubscriptionStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { getStripeClient } from '../../config/stripe';
import { env } from '../../config/env';
import { sendEmail } from '../../config/mailer';
import { paymentFailedEmailHtml } from '../../config/emailTemplates';

function stripeStatusToPrisma(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
      return SubscriptionStatus.ACTIVE;
    case 'past_due':
      return SubscriptionStatus.PAST_DUE;
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return SubscriptionStatus.CANCELED;
    case 'trialing':
      return SubscriptionStatus.TRIALING;
    default:
      return SubscriptionStatus.CANCELED;
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    res.status(500).json({ message: 'Stripe webhook secret not configured' });
    return;
  }

  const stripe = getStripeClient();
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ message: 'Missing stripe-signature header' });
    return;
  }

  let event: Stripe.Event;

  try {
    // req.body is a raw Buffer here (mounted before express.json())
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook verification failed';
    // eslint-disable-next-line no-console
    console.error('Stripe webhook verification failed:', message);
    res.status(400).json({ message });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session.metadata?.['businessId'];
        const planCode = session.metadata?.['planCode'] ?? 'standard';

        if (!businessId || !session.subscription) break;

        const stripeSubscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;

        await prisma.subscription.updateMany({
          where: { businessId },
          data: {
            status: SubscriptionStatus.ACTIVE,
            planCode,
            stripeSubscriptionId
          }
        });

        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const businessId = sub.metadata?.['businessId'];

        if (!businessId) break;

        await prisma.subscription.updateMany({
          where: {
            businessId,
            stripeSubscriptionId: sub.id
          },
          data: {
            status: stripeStatusToPrisma(sub.status),
            currentPeriodEnd: new Date(sub.current_period_end * 1000)
          }
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const businessId = sub.metadata?.['businessId'];

        if (!businessId) break;

        await prisma.subscription.updateMany({
          where: {
            businessId,
            stripeSubscriptionId: sub.id
          },
          data: {
            status: SubscriptionStatus.CANCELED
          }
        });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === 'string'
            ? invoice.customer
            : invoice.customer?.id;

        if (!customerId) break;

        const business = await prisma.business.findFirst({
          where: { stripeCustomerId: customerId }
        });

        if (!business) break;

        await prisma.subscription.updateMany({
          where: { businessId: business.id },
          data: { status: SubscriptionStatus.PAST_DUE }
        });

        // Email the business owner
        const owner = await prisma.user.findFirst({
          where: { businessId: business.id, role: 'OWNER' }
        });
        if (owner?.email) {
          const billingUrl = `${env.FRONTEND_URL ?? 'https://tradebooking.co.uk'}/dashboard/settings?tab=billing`;
          sendEmail({
            to: owner.email,
            subject: `Action required: Payment failed for ${business.name}`,
            html: paymentFailedEmailHtml({
              businessName: business.name,
              ownerName: owner.fullName ?? 'there',
              billingUrl
            })
          }).catch(() => {});
        }

        break;
      }

      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Stripe webhook handler error:', err);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
}
