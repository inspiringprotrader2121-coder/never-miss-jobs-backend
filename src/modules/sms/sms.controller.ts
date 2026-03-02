import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import * as smsService from './sms.service';

const sendSmsSchema = z.object({
  toPhone: z.string().min(7),
  body: z.string().min(1).max(1600)
});

export async function sendAdHocSms(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const { toPhone, body } = sendSmsSchema.parse(req.body);
    await smsService.sendSms({ businessId: req.user.businessId, toPhone, body });
    res.status(200).json({ message: 'SMS sent' });
  } catch (err) { next(err); }
}

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
