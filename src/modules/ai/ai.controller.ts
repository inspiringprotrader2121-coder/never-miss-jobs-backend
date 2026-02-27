import type { NextFunction, Request, Response } from 'express';
import * as aiService from './ai.service';

export async function chatDashboard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const result = await aiService.handleChat(
      {
        businessId: req.user.businessId,
        source: 'dashboard'
      },
      req.body
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function chatPublic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { businessId } = req.params;

    const result = await aiService.handleChat(
      {
        businessId,
        source: 'publicWidget'
      },
      req.body
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

