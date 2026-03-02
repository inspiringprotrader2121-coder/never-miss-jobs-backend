import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, requireRole } from '../../middleware/auth';
import * as businessController from './business.controller';
import * as usersController from './users.controller';
import * as calendarController from '../booking/calendar.controller';
import { getNotifications } from './notifications.controller';

const router = Router();

// Google Calendar OAuth callback is public (Google redirects here without a JWT)
router.get('/calendar/callback', calendarController.oauthCallback);

// Public invite acceptance — no auth required
router.post('/users/accept-invite', usersController.acceptInvite);

router.use(authenticate);

// Any authenticated user can view business info
router.get('/', businessController.getBusiness);
router.get('/stats', businessController.getDashboardStats);
router.get('/analytics', businessController.getAnalytics);
router.get('/notifications', getNotifications);
router.get('/ai-settings', businessController.getAiSettings);

// Only OWNER or ADMIN can update settings
router.patch('/', requireRole([Role.OWNER, Role.ADMIN]), businessController.updateBusiness);
router.patch('/ai-settings', requireRole([Role.OWNER, Role.ADMIN]), businessController.updateAiSettings);

// Google Calendar
router.get('/calendar/connect', requireRole([Role.OWNER, Role.ADMIN]), calendarController.getConnectUrl);
router.get('/calendar/status', calendarController.getCalendarStatus);
router.delete('/calendar/disconnect', requireRole([Role.OWNER]), calendarController.disconnectCalendar);

// Team user management – OWNER only
router.get('/users', requireRole([Role.OWNER, Role.ADMIN]), usersController.listUsers);
router.post('/users', requireRole([Role.OWNER]), usersController.inviteUser);
router.patch('/users/:id/role', requireRole([Role.OWNER]), usersController.updateUserRole);
router.delete('/users/:id', requireRole([Role.OWNER]), usersController.removeUser);

export const businessRouter = router;
