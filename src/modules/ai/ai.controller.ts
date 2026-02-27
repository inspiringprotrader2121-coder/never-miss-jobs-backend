import type { NextFunction, Request, Response } from 'express';
import * as aiService from './ai.service';
import { prisma } from '../../config/prisma';

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

export async function getPublicConfig(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { businessId } = req.params;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { name: true }
    });

    const aiSettings = await prisma.aiSettings.findUnique({
      where: { businessId },
      select: { welcomeMessage: true, qualificationPrompt: true }
    });

    if (!business) {
      res.status(404).json({ message: 'Business not found' });
      return;
    }

    res.status(200).json({
      businessName: business.name,
      welcomeMessage:
        aiSettings?.welcomeMessage ??
        `Hi! I'm the virtual assistant for ${business.name}. How can I help you today?`
    });
  } catch (err) {
    next(err);
  }
}

