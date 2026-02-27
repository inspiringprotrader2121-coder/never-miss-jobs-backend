import type { NextFunction, Request, Response } from 'express';
import * as bookingService from './booking.service';

export async function listAppointments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const result = await bookingService.listAppointments(
      req.user.businessId,
      req.query
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAppointment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const appointment = await bookingService.getAppointment(
      req.user.businessId,
      req.params['id'] as string
    );

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
}

export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const appointment = await bookingService.createAppointment(
      req.user.businessId,
      req.body
    );

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
}

export async function updateAppointment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const appointment = await bookingService.updateAppointment(
      req.user.businessId,
      req.params['id'] as string,
      req.body
    );

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
}

export async function cancelAppointment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }

    const appointment = await bookingService.cancelAppointment(
      req.user.businessId,
      req.params['id'] as string
    );

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
}
