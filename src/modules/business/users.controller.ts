import type { NextFunction, Request, Response } from 'express';
import * as usersService from './users.service';

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const users = await usersService.listUsers(req.user.businessId);
    res.status(200).json({ users });
  } catch (err) { next(err); }
}

export async function inviteUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const user = await usersService.inviteUser(req.user.businessId, req.user.userId, req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
}

export async function acceptInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.acceptInvite(req.body);
    res.status(200).json(user);
  } catch (err) { next(err); }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    const user = await usersService.updateUserRole(
      req.user.businessId,
      req.params['id'] as string,
      req.user.userId,
      req.body
    );
    res.status(200).json(user);
  } catch (err) { next(err); }
}

export async function removeUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) { res.status(401).json({ message: 'Unauthenticated' }); return; }
    await usersService.removeUser(
      req.user.businessId,
      req.params['id'] as string,
      req.user.userId
    );
    res.status(204).send();
  } catch (err) { next(err); }
}
