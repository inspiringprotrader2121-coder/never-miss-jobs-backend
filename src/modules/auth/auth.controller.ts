import type { NextFunction, Request, Response } from 'express';
import * as authService from './auth.service';
import { requestPasswordReset, confirmPasswordReset } from './auth.reset';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await requestPasswordReset(req.body);
    // Always 200 to prevent email enumeration
    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await confirmPasswordReset(req.body);
    res.status(200).json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
}

