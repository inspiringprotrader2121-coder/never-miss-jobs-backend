import type { NextFunction, Request, Response } from 'express';
import * as businessService from './business.service';

export async function getBusiness(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const business = await businessService.getBusiness(req.user.businessId);
    res.status(200).json(business);
  } catch (err) {
    next(err);
  }
}

export async function updateBusiness(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const business = await businessService.updateBusiness(
      req.user.businessId,
      req.body
    );

    res.status(200).json(business);
  } catch (err) {
    next(err);
  }
}

export async function getAiSettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const settings = await businessService.getAiSettings(req.user.businessId);
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}

export async function updateAiSettings(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const settings = await businessService.updateAiSettings(
      req.user.businessId,
      req.body
    );

    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
}
