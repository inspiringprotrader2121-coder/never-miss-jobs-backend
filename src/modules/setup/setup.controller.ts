import type { NextFunction, Request, Response } from 'express';
import * as setupService from './setup.service';

export async function getSetupStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const status = await setupService.getSetupStatus(req.user.businessId);
    res.status(200).json(status);
  } catch (err) { next(err); }
}

export async function updateSetup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const result = await setupService.updateSetup(req.user.businessId, req.body);
    res.status(200).json(result);
  } catch (err) { next(err); }
}

export async function completeSetup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const result = await setupService.completeSetup(req.user.businessId);
    res.status(200).json(result);
  } catch (err) { next(err); }
}
