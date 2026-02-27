import type { NextFunction, Request, Response } from 'express';
import * as billingService from './billing.service';

export async function getSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const subscription = await billingService.getCurrentSubscription(
      req.user.businessId
    );

    res.status(200).json({ subscription });
  } catch (err) {
    next(err);
  }
}

export async function createPortalSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const result = await billingService.createPortalSession(
      { userId: req.user.userId, businessId: req.user.businessId },
      req.body
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createCheckoutSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const result = await billingService.createCheckoutSession(
      {
        userId: req.user.userId,
        businessId: req.user.businessId
      },
      req.body
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

