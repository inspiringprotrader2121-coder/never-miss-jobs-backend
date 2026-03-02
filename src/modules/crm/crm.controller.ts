import type { NextFunction, Request, Response } from 'express';
import * as crmService from './crm.service';

export async function createLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const lead = await crmService.createLead(req.user.businessId, req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

export async function listLeads(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const result = await crmService.listLeads(req.user.businessId, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const lead = await crmService.getLead(
      req.user.businessId,
      req.params['id'] as string
    );

    res.status(200).json(lead);
  } catch (err) {
    next(err);
  }
}

export async function updateLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const lead = await crmService.updateLead(
      req.user.businessId,
      req.params['id'] as string,
      req.body
    );

    res.status(200).json(lead);
  } catch (err) {
    next(err);
  }
}

export async function deleteLead(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const lead = await crmService.deleteLead(
      req.user.businessId,
      req.params['id'] as string
    );

    res.status(200).json(lead);
  } catch (err) {
    next(err);
  }
}
