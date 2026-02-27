import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as authService from './auth.service';
import { requestPasswordReset, confirmPasswordReset } from './auth.reset';
import { prisma } from '../../config/prisma';

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

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'currentPassword and newPassword are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ message: 'New password must be at least 8 characters' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
}

