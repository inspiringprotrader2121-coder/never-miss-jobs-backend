import type { NextFunction, Request, Response } from 'express';
import * as smsService from './sms.service';

export async function getSmsLogs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 20);

    const result = await smsService.getSmsLogs(
      req.user.businessId,
      page,
      limit
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
